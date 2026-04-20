import { getDb } from "@/database/client";

const MIGRATIONS = [
  {
    version: 1,
    sql: `
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS app_meta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );

      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        parent_id TEXT REFERENCES locations(id) ON DELETE RESTRICT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
        photo_uri TEXT,
        quantity INTEGER,
        notes TEXT,
        is_favorite INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE COLLATE NOCASE
      );

      CREATE TABLE IF NOT EXISTS item_tags (
        item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
        tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (item_id, tag_id)
      );

      CREATE TABLE IF NOT EXISTS recent_searches (
        id TEXT PRIMARY KEY NOT NULL,
        query TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_locations_parent_id ON locations(parent_id);
      CREATE INDEX IF NOT EXISTS idx_items_location_id ON items(location_id);
      CREATE INDEX IF NOT EXISTS idx_items_name ON items(name COLLATE NOCASE);
      CREATE INDEX IF NOT EXISTS idx_recent_searches_created_at ON recent_searches(created_at DESC);
    `
  },
  {
    version: 2,
    sql: `
      ALTER TABLE locations ADD COLUMN photo_uri TEXT;
    `
  }
];

export const initializeDatabase = async () => {
  const db = await getDb();
  await db.execAsync("PRAGMA foreign_keys = ON;");

  const result = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version;");
  const currentVersion = result?.user_version ?? 0;

  for (const migration of MIGRATIONS) {
    if (migration.version <= currentVersion) {
      continue;
    }

    await db.withTransactionAsync(async () => {
      await db.execAsync(migration.sql);
      await db.execAsync(`PRAGMA user_version = ${migration.version};`);
    });
  }
};
