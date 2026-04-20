import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { getDb } from "@/database/client";
import { AppLanguage, translate } from "@/i18n/core";
import { BackupPayload } from "@/types/entities";
import { backupSchema } from "@/utils/validation";

const BACKUP_VERSION = 1;

type BackupOptions = {
  language: AppLanguage;
};

const sortLocationsForImport = <T extends { id: string; parentId: string | null }>(
  locations: T[],
  language: AppLanguage
) => {
  const remaining = [...locations];
  const inserted = new Set<string>();
  const ordered: T[] = [];

  while (remaining.length > 0) {
    const startLength = remaining.length;

    for (let index = remaining.length - 1; index >= 0; index -= 1) {
      const location = remaining[index];
      if (!location.parentId || inserted.has(location.parentId)) {
        ordered.push(location);
        inserted.add(location.id);
        remaining.splice(index, 1);
      }
    }

    if (remaining.length === startLength) {
      throw new Error(translate(language, "backup.corruptedStructure"));
    }
  }

  return ordered;
};

export const exportBackup = async ({ language }: BackupOptions) => {
  const db = await getDb();

  const payload: BackupPayload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    locations: await db.getAllAsync<BackupPayload["locations"][number]>(
      "SELECT id, name, parent_id as parentId, photo_uri as photoUri, created_at as createdAt, updated_at as updatedAt FROM locations ORDER BY created_at ASC;"
    ),
    items: await db.getAllAsync<BackupPayload["items"][number]>(
      "SELECT id, name, location_id as locationId, photo_uri as photoUri, quantity, notes, is_favorite as isFavorite, created_at as createdAt, updated_at as updatedAt FROM items ORDER BY created_at ASC;"
    ),
    tags: await db.getAllAsync<BackupPayload["tags"][number]>(
      "SELECT id, name FROM tags ORDER BY name COLLATE NOCASE ASC;"
    ),
    itemTags: await db.getAllAsync<BackupPayload["itemTags"][number]>(
      "SELECT item_id as itemId, tag_id as tagId FROM item_tags;"
    ),
    recentSearches: await db.getAllAsync<BackupPayload["recentSearches"][number]>(
      "SELECT id, query, created_at as createdAt FROM recent_searches ORDER BY created_at DESC;"
    )
  };

  const directory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
  if (!directory) {
    throw new Error(translate(language, "backup.fileSystemAccessError"));
  }

  const fileUri = `${directory}gde-lezhit-backup-${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2), {
    encoding: FileSystem.EncodingType.UTF8
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/json",
      dialogTitle: translate(language, "backup.shareDialogTitle")
    });
  }

  return fileUri;
};

export const pickBackupFile = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
    multiple: false
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return result.assets[0].uri;
};

const insertBackup = async (
  payload: BackupPayload,
  mode: "replace" | "merge",
  language: AppLanguage
) => {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    if (mode === "replace") {
      await db.execAsync(`
        DELETE FROM item_tags;
        DELETE FROM tags;
        DELETE FROM items;
        DELETE FROM recent_searches;
        DELETE FROM locations;
      `);
    }

    for (const location of sortLocationsForImport(payload.locations, language)) {
      await db.runAsync(
        `INSERT OR REPLACE INTO locations (id, name, parent_id, photo_uri, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [location.id, location.name, location.parentId, location.photoUri, location.createdAt, location.updatedAt]
      );
    }

    for (const item of payload.items) {
      await db.runAsync(
        `INSERT OR REPLACE INTO items (id, name, location_id, photo_uri, quantity, notes, is_favorite, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          item.id,
          item.name,
          item.locationId,
          item.photoUri,
          item.quantity,
          item.notes,
          item.isFavorite,
          item.createdAt,
          item.updatedAt
        ]
      );
    }

    for (const tag of payload.tags) {
      await db.runAsync("INSERT OR REPLACE INTO tags (id, name) VALUES (?, ?);", [tag.id, tag.name]);
    }

    if (mode === "merge") {
      for (const relation of payload.itemTags) {
        await db.runAsync(
          "INSERT OR IGNORE INTO item_tags (item_id, tag_id) VALUES (?, ?);",
          [relation.itemId, relation.tagId]
        );
      }

      for (const search of payload.recentSearches) {
        await db.runAsync(
          "INSERT OR REPLACE INTO recent_searches (id, query, created_at) VALUES (?, ?, ?);",
          [search.id, search.query, search.createdAt]
        );
      }
    } else {
      for (const relation of payload.itemTags) {
        await db.runAsync("INSERT INTO item_tags (item_id, tag_id) VALUES (?, ?);", [
          relation.itemId,
          relation.tagId
        ]);
      }

      for (const search of payload.recentSearches) {
        await db.runAsync("INSERT INTO recent_searches (id, query, created_at) VALUES (?, ?, ?);", [
          search.id,
          search.query,
          search.createdAt
        ]);
      }
    }

    await db.runAsync(
      "INSERT OR REPLACE INTO app_meta (key, value) VALUES ('demo_seeded', '1');"
    );
  });
};

export const importBackup = async (mode: "replace" | "merge", { language }: BackupOptions) => {
  const fileUri = await pickBackupFile();
  if (!fileUri) {
    return false;
  }

  const raw = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.UTF8
  });
  const parsed = JSON.parse(raw);
  const payload = backupSchema.parse(parsed) as BackupPayload;

  await insertBackup(payload, mode, language);
  return true;
};
