import { getDb } from "@/database/client";
import { AppLanguage } from "@/i18n/core";

const LANGUAGE_KEY = "app_language";

export const getStoredLanguage = async () => {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string | null }>(
    "SELECT value FROM app_meta WHERE key = ?;",
    [LANGUAGE_KEY]
  );

  if (row?.value === "ru" || row?.value === "en") {
    return row.value as AppLanguage;
  }

  return null;
};

export const setStoredLanguage = async (language: AppLanguage) => {
  const db = await getDb();
  await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?);", [
    LANGUAGE_KEY,
    language
  ]);
};
