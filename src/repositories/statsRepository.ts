import { getDb } from "@/database/client";
import { AppStats } from "@/types/entities";

import { itemRepository } from "./itemRepository";

export const statsRepository = {
  async getStats(): Promise<AppStats> {
    const db = await getDb();
    const [items, locations] = await Promise.all([
      db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM items;"),
      db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM locations;")
    ]);

    return {
      totalItems: items?.count ?? 0,
      totalLocations: locations?.count ?? 0
    };
  },

  async getHomeSnapshot() {
    const [stats, recentItems, favorites] = await Promise.all([
      this.getStats(),
      itemRepository.getRecent(5),
      itemRepository.getFavorites(5)
    ]);

    return {
      stats,
      recentItems,
      favorites
    };
  }
};
