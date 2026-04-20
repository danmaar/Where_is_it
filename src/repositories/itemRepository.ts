import { getDb } from "@/database/client";
import { ItemDetails, ItemInput, ItemListRow } from "@/types/entities";
import { createId } from "@/utils/ids";

import { locationRepository } from "./locationRepository";

const nowIso = () => new Date().toISOString();

type ItemRow = {
  id: string;
  name: string;
  locationId: string;
  photoUri: string | null;
  quantity: number | null;
  notes: string | null;
  isFavorite: number | boolean;
  createdAt: string;
  updatedAt: string;
};

type ItemListRowBase = ItemRow & {
  locationPath: string;
};

const mapItemBase = <T extends { isFavorite: number | boolean }>(item: T) => ({
  ...item,
  isFavorite: Boolean(item.isFavorite)
});

const syncItemTags = async (itemId: string, tags: string[]) => {
  const db = await getDb();
  await db.runAsync("DELETE FROM item_tags WHERE item_id = ?;", [itemId]);

  for (const tagName of tags) {
    const existingTag = await db.getFirstAsync<{ id: string }>(
      "SELECT id FROM tags WHERE name = ? COLLATE NOCASE;",
      [tagName]
    );
    const tagId = existingTag?.id ?? createId("tag");
    if (!existingTag) {
      await db.runAsync("INSERT INTO tags (id, name) VALUES (?, ?);", [tagId, tagName]);
    }

    await db.runAsync("INSERT OR IGNORE INTO item_tags (item_id, tag_id) VALUES (?, ?);", [
      itemId,
      tagId
    ]);
  }

  await db.execAsync(`
    DELETE FROM tags
    WHERE id NOT IN (SELECT DISTINCT tag_id FROM item_tags);
  `);
};

const fetchTags = async (itemId: string) => {
  const db = await getDb();
  const rows = await db.getAllAsync<{ name: string }>(
    `
      SELECT t.name
      FROM item_tags it
      JOIN tags t ON t.id = it.tag_id
      WHERE it.item_id = ?
      ORDER BY t.name COLLATE NOCASE ASC;
    `,
    [itemId]
  );
  return rows.map((row) => row.name);
};

const fetchItemRowsWithTags = async (rows: ItemListRowBase[]): Promise<ItemListRow[]> => {
  return Promise.all(
    rows.map(async (row) => ({
      ...mapItemBase(row),
      tags: await fetchTags(row.id)
    }))
  );
};

export const itemRepository = {
  async getAll(favoritesOnly = false): Promise<ItemListRow[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<ItemListRowBase>(
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
          (
            WITH RECURSIVE ancestors(id, name, parent_id, depth) AS (
              SELECT id, name, parent_id, 0 as depth
              FROM locations
              WHERE id = i.location_id
              UNION ALL
              SELECT l.id, l.name, l.parent_id, a.depth + 1
              FROM locations l
              JOIN ancestors a ON a.parent_id = l.id
            )
            SELECT group_concat(name, ' / ')
            FROM (SELECT name FROM ancestors ORDER BY depth DESC)
          ) as locationPath
        FROM items i
        ${favoritesOnly ? "WHERE i.is_favorite = 1" : ""}
        ORDER BY i.updated_at DESC, i.name COLLATE NOCASE ASC;
      `
    );

    return fetchItemRowsWithTags(rows);
  },

  async getById(id: string): Promise<ItemDetails | null> {
    const db = await getDb();
    const item = await db.getFirstAsync<ItemRow>(
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
          i.updated_at as updatedAt
        FROM items i
        WHERE i.id = ?;
      `,
      [id]
    );

    if (!item) {
      return null;
    }

    return {
      ...mapItemBase(item),
      locationPath: await locationRepository.getPath(item.locationId),
      tags: await fetchTags(id)
    };
  },

  async create(input: ItemInput) {
    const db = await getDb();
    const id = createId("item");
    const timestamp = nowIso();
    await db.runAsync(
      `INSERT INTO items (id, name, location_id, photo_uri, quantity, notes, is_favorite, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        input.name,
        input.locationId,
        input.photoUri,
        input.quantity,
        input.notes,
        input.isFavorite ? 1 : 0,
        timestamp,
        timestamp
      ]
    );
    await syncItemTags(id, input.tags);
    return id;
  },

  async update(id: string, input: ItemInput) {
    const db = await getDb();
    await db.runAsync(
      `UPDATE items
       SET name = ?, location_id = ?, photo_uri = ?, quantity = ?, notes = ?, is_favorite = ?, updated_at = ?
       WHERE id = ?;`,
      [
        input.name,
        input.locationId,
        input.photoUri,
        input.quantity,
        input.notes,
        input.isFavorite ? 1 : 0,
        nowIso(),
        id
      ]
    );
    await syncItemTags(id, input.tags);
  },

  async delete(id: string) {
    const db = await getDb();
    await db.runAsync("DELETE FROM items WHERE id = ?;", [id]);
  },

  async toggleFavorite(id: string, isFavorite: boolean) {
    const db = await getDb();
    await db.runAsync("UPDATE items SET is_favorite = ?, updated_at = ? WHERE id = ?;", [
      isFavorite ? 1 : 0,
      nowIso(),
      id
    ]);
  },

  async updateQuantity(id: string, quantity: number | null) {
    const db = await getDb();
    await db.runAsync("UPDATE items SET quantity = ? WHERE id = ?;", [quantity, id]);
  },

  async getRecent(limit = 5) {
    const items = await this.getAll(false);
    return items.slice(0, limit);
  },

  async getFavorites(limit = 5) {
    const items = await this.getAll(true);
    return items.slice(0, limit);
  }
};
