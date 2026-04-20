import { SQLiteDatabase, openDatabaseAsync } from "expo-sqlite";

let dbPromise: Promise<SQLiteDatabase> | null = null;

export const getDb = async () => {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync("where-is-it.db");
  }

  return dbPromise;
};
