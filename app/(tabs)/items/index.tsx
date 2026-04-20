import { useFocusEffect, router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FAB, SegmentedButtons, Text } from "react-native-paper";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ItemCard } from "@/components/ItemCard";
import { Screen } from "@/components/Screen";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";
import { itemRepository } from "@/repositories/itemRepository";
import { ItemListRow } from "@/types/entities";

type SortMode = "quantity-asc" | "quantity-desc" | "name-asc" | "name-desc";

export default function ItemsScreen() {
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [items, setItems] = useState<ItemListRow[]>([]);
  const [pendingFavoriteRemoval, setPendingFavoriteRemoval] = useState<ItemListRow | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("name-asc");
  const revision = useAppStore((state) => state.revision);
  const bumpRevision = useAppStore((state) => state.bumpRevision);
  const { language, t } = useI18n();

  const sortItems = useCallback(
    (source: ItemListRow[]) => {
      const collator = new Intl.Collator(language === "ru" ? "ru-RU" : "en-US", {
        sensitivity: "base"
      });

      return [...source].sort((left, right) => {
        if (sortMode === "quantity-asc" || sortMode === "quantity-desc") {
          const leftQuantity = left.quantity ?? 0;
          const rightQuantity = right.quantity ?? 0;

          if (leftQuantity !== rightQuantity) {
            return sortMode === "quantity-asc"
              ? leftQuantity - rightQuantity
              : rightQuantity - leftQuantity;
          }
        }

        const nameCompare = collator.compare(left.name, right.name);
        return sortMode === "name-desc" ? -nameCompare : nameCompare;
      });
    },
    [language, sortMode]
  );

  const load = useCallback(async () => {
    const loadedItems = await itemRepository.getAll(filter === "favorites");
    setItems(sortItems(loadedItems));
  }, [filter, sortItems]);

  useEffect(() => {
    setItems((currentItems) => sortItems(currentItems));
  }, [sortItems]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load, revision])
  );

  const handleFavoritePress = async (item: ItemListRow) => {
    if (!item.isFavorite) {
      await itemRepository.toggleFavorite(item.id, true);
      bumpRevision();
      setItems(sortItems(await itemRepository.getAll(filter === "favorites")));
      return;
    }

    setPendingFavoriteRemoval(item);
  };

  const handleQuantityChange = async (item: ItemListRow, delta: number) => {
    const nextQuantity = Math.max(0, (item.quantity ?? 0) + delta);
    await itemRepository.updateQuantity(item.id, nextQuantity);
    bumpRevision();
    setItems(sortItems(await itemRepository.getAll(filter === "favorites")));
  };

  const handleConfirmFavoriteRemoval = async () => {
    if (!pendingFavoriteRemoval) {
      return;
    }

    await itemRepository.toggleFavorite(pendingFavoriteRemoval.id, false);
    setPendingFavoriteRemoval(null);
    bumpRevision();
    setItems(sortItems(await itemRepository.getAll(filter === "favorites")));
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
        <Text variant="labelLarge">{language === "ru" ? "Сортировка" : "Sort"}</Text>
        <SegmentedButtons
          value={sortMode}
          onValueChange={(value) => setSortMode(value as SortMode)}
          buttons={[
            {
              value: "name-asc",
              label: language === "ru" ? "А-Я" : "A-Z",
              icon: "sort-alphabetical-ascending"
            },
            {
              value: "name-desc",
              label: language === "ru" ? "Я-А" : "Z-A",
              icon: "sort-alphabetical-descending"
            },
            {
              value: "quantity-asc",
              label: "1-9",
              icon: "sort-numeric-ascending"
            },
            {
              value: "quantity-desc",
              label: "9-1",
              icon: "sort-numeric-descending"
            }
          ]}
        />
        {items.length ? (
          items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              photoPosition="right"
              onFavoritePress={handleFavoritePress}
              onDecreaseQuantity={() => void handleQuantityChange(item, -1)}
              onIncreaseQuantity={() => void handleQuantityChange(item, 1)}
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
      <ConfirmDialog
        visible={Boolean(pendingFavoriteRemoval)}
        title={language === "ru" ? "Удалить из избранного?" : "Remove from favorites?"}
        confirmLabel={language === "ru" ? "Да" : "Yes"}
        cancelLabel={language === "ru" ? "Нет" : "No"}
        onCancel={() => setPendingFavoriteRemoval(null)}
        onConfirm={() => void handleConfirmFavoriteRemoval()}
      />
    </>
  );
}
