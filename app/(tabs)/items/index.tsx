import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { FAB, SegmentedButtons } from "react-native-paper";

import { EmptyState } from "@/components/EmptyState";
import { ItemCard } from "@/components/ItemCard";
import { Screen } from "@/components/Screen";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";
import { itemRepository } from "@/repositories/itemRepository";
import { ItemListRow } from "@/types/entities";

export default function ItemsScreen() {
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [items, setItems] = useState<ItemListRow[]>([]);
  const revision = useAppStore((state) => state.revision);
  const bumpRevision = useAppStore((state) => state.bumpRevision);
  const { t } = useI18n();

  const load = useCallback(async () => {
    setItems(await itemRepository.getAll(filter === "favorites"));
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load, revision])
  );

  const handleFavoritePress = async (item: ItemListRow) => {
    await itemRepository.toggleFavorite(item.id, !item.isFavorite);
    bumpRevision();
    setItems(await itemRepository.getAll(filter === "favorites"));
  };

  return (
    <>
      <Screen>
        <SegmentedButtons
          value={filter}
          onValueChange={(value) => setFilter(value as "all" | "favorites")}
          buttons={[
            { value: "all", label: t("common.all") },
            { value: "favorites", label: t("common.favorites") }
          ]}
        />
        {items.length ? (
          items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              photoPosition="right"
              onFavoritePress={handleFavoritePress}
            />
          ))
        ) : (
          <EmptyState
            icon={filter === "favorites" ? "star-off-outline" : "archive-outline"}
            title={filter === "favorites" ? t("items.emptyFavoritesTitle") : t("items.emptyItemsTitle")}
            description={
              filter === "favorites"
                ? t("items.emptyFavoritesDescription")
                : t("items.emptyItemsDescription")
            }
            actionLabel={t("home.addItem")}
            onActionPress={() => router.push("/item/edit")}
          />
        )}
      </Screen>
      <FAB
        icon="plus"
        label={t("common.add")}
        style={{ position: "absolute", right: 16, bottom: 16 }}
        onPress={() => router.push("/item/edit")}
      />
    </>
  );
}
