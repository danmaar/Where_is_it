import { getDb } from "@/database/client";
import { ItemListRow, RecentSearchEntity } from "@/types/entities";
import { createId } from "@/utils/ids";

import { itemRepository } from "./itemRepository";

const normalizeSearchText = (value: string) => value.normalize("NFKC").trim().toLocaleLowerCase();

const matchesQuery = (item: ItemListRow, query: string) => {
  const haystacks = [
    item.name,
    item.locationPath,
    item.notes ?? "",
    ...item.tags
  ];

  return haystacks.some((value) => normalizeSearchText(value).includes(query));
};

export const searchRepository = {
  async searchItems(query: string): Promise<ItemListRow[]> {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) {
      return [];
    }

    const items = await itemRepository.getAll(false);
    return items.filter((item) => matchesQuery(item, normalizedQuery));
  },

  async addRecentSearch(query: string) {
    const db = await getDb();
    const value = query.trim();
    if (!value) {
      return;
    }

    await db.runAsync("DELETE FROM recent_searches WHERE LOWER(query) = LOWER(?);", [value]);
    await db.runAsync("INSERT INTO recent_searches (id, query, created_at) VALUES (?, ?, ?);", [
      createId("search"),
      value,
      new Date().toISOString()
    ]);
    await db.execAsync(`
      DELETE FROM recent_searches
      WHERE id NOT IN (
        SELECT id FROM recent_searches ORDER BY created_at DESC LIMIT 10
      );
    `);
  },

  async getRecentSearches(): Promise<RecentSearchEntity[]> {
    const db = await getDb();
    return db.getAllAsync<RecentSearchEntity>(
      `
        SELECT id, query, created_at as createdAt
        FROM recent_searches
        ORDER BY created_at DESC
        LIMIT 10;
      `
    );
  },

  async clearRecentSearches() {
    const db = await getDb();
    await db.execAsync("DELETE FROM recent_searches;");
  }
};
