import { getDb } from "@/database/client";
import { useAppStore } from "@/features/app/useAppStore";
import { translate } from "@/i18n/core";
import { ItemListRow, LocationDetails, LocationInput, LocationNode } from "@/types/entities";
import { createId } from "@/utils/ids";

const nowIso = () => new Date().toISOString();
const getErrorText = (key: string) => translate(useAppStore.getState().language, key);

type RawLocationRow = {
  id: string;
  name: string;
  parentId: string | null;
  photoUri: string | null;
  createdAt: string;
  updatedAt: string;
  path: string;
  depth: number;
  childCount: number;
  itemCount: number;
};

type DirectItemRow = {
  id: string;
  name: string;
  locationId: string;
  photoUri: string | null;
  quantity: number | null;
  notes: string | null;
  isFavorite: number | boolean;
  createdAt: string;
  updatedAt: string;
  locationPath: string;
};

const listIdsInSubtree = async (locationId: string) => {
  const db = await getDb();
  const rows = await db.getAllAsync<{ id: string }>(
    `
      WITH RECURSIVE descendants(id) AS (
        SELECT id FROM locations WHERE id = ?
        UNION ALL
        SELECT l.id FROM locations l
        JOIN descendants d ON l.parent_id = d.id
      )
      SELECT id FROM descendants;
    `,
    [locationId]
  );
  return rows.map((row) => row.id);
};

export const locationRepository = {
  async getAll(): Promise<LocationNode[]> {
    const db = await getDb();
    return db.getAllAsync<RawLocationRow>(`
      WITH RECURSIVE location_paths AS (
        SELECT
          id,
          name,
          parent_id as parentId,
          photo_uri as photoUri,
          created_at as createdAt,
          updated_at as updatedAt,
          name as path,
          0 as depth
        FROM locations
        WHERE parent_id IS NULL
        UNION ALL
        SELECT
          l.id,
          l.name,
          l.parent_id as parentId,
          l.photo_uri as photoUri,
          l.created_at as createdAt,
          l.updated_at as updatedAt,
          lp.path || ' / ' || l.name as path,
          lp.depth + 1 as depth
        FROM locations l
        JOIN location_paths lp ON l.parent_id = lp.id
      )
      SELECT
        lp.*,
        (SELECT COUNT(*) FROM locations child WHERE child.parent_id = lp.id) as childCount,
        (SELECT COUNT(*) FROM items item WHERE item.location_id = lp.id) as itemCount
      FROM location_paths lp
      ORDER BY lp.path COLLATE NOCASE ASC;
    `);
  },

  async getById(id: string) {
    const db = await getDb();
    return db.getFirstAsync<{
      id: string;
      name: string;
      parentId: string | null;
      photoUri: string | null;
      createdAt: string;
      updatedAt: string;
    }>(
      `
        SELECT
          id,
          name,
          parent_id as parentId,
          photo_uri as photoUri,
          created_at as createdAt,
          updated_at as updatedAt
        FROM locations
        WHERE id = ?;
      `,
      [id]
    );
  },

  async getPath(id: string) {
    const db = await getDb();
    const rows = await db.getAllAsync<{ name: string; depth: number }>(
      `
        WITH RECURSIVE ancestors(id, name, parent_id, depth) AS (
          SELECT id, name, parent_id, 0 as depth
          FROM locations
          WHERE id = ?
          UNION ALL
          SELECT l.id, l.name, l.parent_id, a.depth + 1
          FROM locations l
          JOIN ancestors a ON a.parent_id = l.id
        )
        SELECT name, depth FROM ancestors ORDER BY depth DESC;
      `,
      [id]
    );

    return rows.map((row) => row.name).join(" / ");
  },

  async getDetails(id: string): Promise<LocationDetails | null> {
    const location = await this.getById(id);
    if (!location) {
      return null;
    }

    const [path, allLocations] = await Promise.all([this.getPath(id), this.getAll()]);
    const childLocations = allLocations.filter((locationItem) => locationItem.parentId === id);

    const db = await getDb();
    const directItems = await db.getAllAsync<DirectItemRow>(
      `
        SELECT
          i.id,
          i.name,
          i.location_id as locationId,
          i.photo_uri as photoUri,
          i.quantity,
          i.notes,
          i.is_favorite as isFavorite,
          i.created_at as createdAt,
          i.updated_at as updatedAt,
          ? as locationPath
        FROM items i
        WHERE i.location_id = ?
        ORDER BY i.name COLLATE NOCASE ASC;
      `,
      [path, id]
    );

    const directItemsWithTags: ItemListRow[] = await Promise.all(
      directItems.map(async (item) => {
        const tags = await db.getAllAsync<{ name: string }>(
          `
            SELECT t.name
            FROM item_tags it
            JOIN tags t ON t.id = it.tag_id
            WHERE it.item_id = ?
            ORDER BY t.name COLLATE NOCASE ASC;
          `,
          [item.id]
        );
        return {
          ...item,
          isFavorite: Boolean(item.isFavorite),
          tags: tags.map((tag) => tag.name)
        };
      })
    );

    return {
      ...location,
      path,
      childLocations,
      directItems: directItemsWithTags
    };
  },

  async getSelectableParents(currentLocationId?: string | null) {
    const all = await this.getAll();
    if (!currentLocationId) {
      return all;
    }

    const blockedIds = new Set(await listIdsInSubtree(currentLocationId));
    return all.filter((location) => !blockedIds.has(location.id));
  },

  async create(input: LocationInput) {
    const db = await getDb();
    const id = createId("loc");
    const timestamp = nowIso();
    await db.runAsync(
      `INSERT INTO locations (id, name, parent_id, photo_uri, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [id, input.name, input.parentId, input.photoUri, timestamp, timestamp]
    );
    return id;
  },

  async update(id: string, input: LocationInput) {
    if (input.parentId) {
      const blockedIds = await listIdsInSubtree(id);
      if (blockedIds.includes(input.parentId)) {
        throw new Error(getErrorText("errors.locationCircularParent"));
      }
    }

    const db = await getDb();
    await db.runAsync(
      `UPDATE locations
       SET name = ?, parent_id = ?, photo_uri = ?, updated_at = ?
       WHERE id = ?;`,
      [input.name, input.parentId, input.photoUri, nowIso(), id]
    );
  },

  async delete(id: string) {
    const db = await getDb();
    const [children, items] = await Promise.all([
      db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM locations WHERE parent_id = ?;", [id]),
      db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM items WHERE location_id = ?;", [id])
    ]);

    if ((children?.count ?? 0) > 0) {
      throw new Error(getErrorText("errors.locationHasChildren"));
    }

    if ((items?.count ?? 0) > 0) {
      throw new Error(getErrorText("errors.locationHasItems"));
    }

    await db.runAsync("DELETE FROM locations WHERE id = ?;", [id]);
  }
};
