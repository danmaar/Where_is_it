import { getDb } from "@/database/client";
import { getDefaultLanguage } from "@/i18n/core";
import { createId } from "@/utils/ids";

const nowIso = () => new Date().toISOString();

type SeedLocation = {
  name: string;
  parentKey?: string;
  key: string;
};

type SeedItem = {
  name: string;
  locationKey: string;
  quantity?: number;
  notes?: string;
  isFavorite?: boolean;
  tags?: string[];
};

const seedData = {
  ru: {
    locations: [
      { key: "home", name: "Дом" },
      { key: "kitchen", name: "Кухня", parentKey: "home" },
      { key: "kitchen-top", name: "Верхний ящик", parentKey: "kitchen" },
      { key: "closet", name: "Шкаф", parentKey: "home" },
      { key: "docs", name: "Документы", parentKey: "closet" },
      { key: "garage", name: "Гараж", parentKey: "home" },
      { key: "garage-rack-2", name: "Стеллаж 2", parentKey: "garage" },
      { key: "bathroom", name: "Ванная", parentKey: "home" },
      { key: "bathroom-cabinet", name: "Шкафчик", parentKey: "bathroom" },
      { key: "balcony", name: "Балкон", parentKey: "home" },
      { key: "blue-box", name: "Синяя коробка", parentKey: "balcony" }
    ] satisfies SeedLocation[],
    items: [
      { name: "Батарейки AA", locationKey: "kitchen-top", quantity: 8, tags: ["электрика", "запасы"] },
      {
        name: "Загранпаспорт",
        locationKey: "docs",
        notes: "Лежит в прозрачной папке",
        isFavorite: true,
        tags: ["документы"]
      },
      { name: "Удлинитель", locationKey: "garage-rack-2", quantity: 1, tags: ["инструменты"] },
      { name: "Аптечка", locationKey: "bathroom-cabinet", isFavorite: true, tags: ["медицина"] },
      { name: "Гирлянда", locationKey: "blue-box", quantity: 2, tags: ["праздник", "сезонное"] }
    ] satisfies SeedItem[]
  },
  en: {
    locations: [
      { key: "home", name: "Home" },
      { key: "kitchen", name: "Kitchen", parentKey: "home" },
      { key: "kitchen-top", name: "Top drawer", parentKey: "kitchen" },
      { key: "closet", name: "Closet", parentKey: "home" },
      { key: "docs", name: "Documents", parentKey: "closet" },
      { key: "garage", name: "Garage", parentKey: "home" },
      { key: "garage-rack-2", name: "Rack 2", parentKey: "garage" },
      { key: "bathroom", name: "Bathroom", parentKey: "home" },
      { key: "bathroom-cabinet", name: "Cabinet", parentKey: "bathroom" },
      { key: "balcony", name: "Balcony", parentKey: "home" },
      { key: "blue-box", name: "Blue box", parentKey: "balcony" }
    ] satisfies SeedLocation[],
    items: [
      { name: "AA batteries", locationKey: "kitchen-top", quantity: 8, tags: ["electronics", "supplies"] },
      {
        name: "Passport",
        locationKey: "docs",
        notes: "Stored in a transparent folder",
        isFavorite: true,
        tags: ["documents"]
      },
      { name: "Extension cord", locationKey: "garage-rack-2", quantity: 1, tags: ["tools"] },
      { name: "First aid kit", locationKey: "bathroom-cabinet", isFavorite: true, tags: ["medical"] },
      { name: "String lights", locationKey: "blue-box", quantity: 2, tags: ["holiday", "seasonal"] }
    ] satisfies SeedItem[]
  }
} as const;

export const seedDatabaseIfNeeded = async () => {
  const db = await getDb();
  const seeded = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM app_meta WHERE key = 'demo_seeded';"
  );

  if (seeded?.value === "1") {
    return;
  }

  const language = getDefaultLanguage();
  const activeSeed = seedData[language];

  await db.withTransactionAsync(async () => {
    const locationIds = new Map<string, string>();

    for (const location of activeSeed.locations) {
      const id = createId("loc");
      const timestamp = nowIso();
      locationIds.set(location.key, id);
      await db.runAsync(
        `INSERT INTO locations (id, name, parent_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?);`,
        [
          id,
          location.name,
          location.parentKey ? locationIds.get(location.parentKey) ?? null : null,
          timestamp,
          timestamp
        ]
      );
    }

    for (const item of activeSeed.items) {
      const itemId = createId("item");
      const timestamp = nowIso();
      const locationId = locationIds.get(item.locationKey);
      if (!locationId) {
        throw new Error(`Seed error: location "${item.locationKey}" not found.`);
      }
      await db.runAsync(
        `INSERT INTO items (id, name, location_id, photo_uri, quantity, notes, is_favorite, created_at, updated_at)
         VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?);`,
        [
          itemId,
          item.name,
          locationId,
          item.quantity ?? null,
          item.notes ?? null,
          item.isFavorite ? 1 : 0,
          timestamp,
          timestamp
        ]
      );

      for (const tagName of item.tags ?? []) {
        const existingTag = await db.getFirstAsync<{ id: string }>(
          "SELECT id FROM tags WHERE name = ? COLLATE NOCASE;",
          [tagName]
        );
        const tagId = existingTag?.id ?? createId("tag");
        if (!existingTag) {
          await db.runAsync("INSERT INTO tags (id, name) VALUES (?, ?);", [tagId, tagName]);
        }
        await db.runAsync("INSERT INTO item_tags (item_id, tag_id) VALUES (?, ?);", [itemId, tagId]);
      }
    }

    await db.runAsync(
      "INSERT OR REPLACE INTO app_meta (key, value) VALUES ('demo_seeded', '1');"
    );
  });
};
