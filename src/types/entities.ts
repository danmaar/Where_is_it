export type EntityId = string;

export type LocationEntity = {
  id: EntityId;
  name: string;
  parentId: EntityId | null;
  createdAt: string;
  updatedAt: string;
};

export type LocationNode = LocationEntity & {
  path: string;
  depth: number;
  childCount: number;
  itemCount: number;
};

export type LocationDetails = LocationEntity & {
  path: string;
  childLocations: LocationNode[];
  directItems: ItemListRow[];
};

export type TagEntity = {
  id: EntityId;
  name: string;
};

export type ItemEntity = {
  id: EntityId;
  name: string;
  locationId: EntityId;
  photoUri: string | null;
  quantity: number | null;
  notes: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ItemListRow = ItemEntity & {
  locationPath: string;
  tags: string[];
};

export type ItemDetails = ItemEntity & {
  locationPath: string;
  tags: string[];
};

export type RecentSearchEntity = {
  id: EntityId;
  query: string;
  createdAt: string;
};

export type AppStats = {
  totalItems: number;
  totalLocations: number;
};

export type BackupPayload = {
  version: number;
  exportedAt: string;
  locations: LocationEntity[];
  items: Array<Omit<ItemEntity, "isFavorite"> & { isFavorite: number }>;
  tags: TagEntity[];
  itemTags: Array<{ itemId: EntityId; tagId: EntityId }>;
  recentSearches: RecentSearchEntity[];
};

export type ItemInput = {
  name: string;
  locationId: EntityId;
  photoUri: string | null;
  quantity: number | null;
  notes: string | null;
  isFavorite: boolean;
  tags: string[];
};

export type LocationInput = {
  name: string;
  parentId: EntityId | null;
};
