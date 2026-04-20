import { useFocusEffect } from "expo-router";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ItemCard } from "@/components/ItemCard";
import { Screen } from "@/components/Screen";
import { SearchBarCard } from "@/components/SearchBarCard";
import { StatCard } from "@/components/StatCard";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";
import { itemRepository } from "@/repositories/itemRepository";
import { statsRepository } from "@/repositories/statsRepository";
import { ItemListRow } from "@/types/entities";

type HomeData = Awaited<ReturnType<typeof statsRepository.getHomeSnapshot>>;

export default function HomeScreen() {
  const [data, setData] = useState<HomeData | null>(null);
  const [pendingFavoriteRemoval, setPendingFavoriteRemoval] = useState<ItemListRow | null>(null);
  const revision = useAppStore((state) => state.revision);
  const bumpRevision = useAppStore((state) => state.bumpRevision);
  const { language, t } = useI18n();

  const load = useCallback(async () => {
    setData(await statsRepository.getHomeSnapshot());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load, revision])
  );

  const handleFavoritePress = async (item: ItemListRow) => {
    if (!item.isFavorite) {
      await itemRepository.toggleFavorite(item.id, true);
      bumpRevision();
      await load();
      return;
    }

    setPendingFavoriteRemoval(item);
  };

  const handleConfirmFavoriteRemoval = async () => {
    if (!pendingFavoriteRemoval) {
      return;
    }

    await itemRepository.toggleFavorite(pendingFavoriteRemoval.id, false);
    setPendingFavoriteRemoval(null);
    bumpRevision();
    await load();
  };

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <Text variant="headlineMedium">{t("appName")}</Text>
        <Text style={{ opacity: 0.75 }}>{t("home.subtitle")}</Text>
      </View>

      <SearchBarCard onPress={() => router.push("/(tabs)/search")} />

      <View style={{ flexDirection: "row", gap: 12 }}>
        <StatCard label={t("home.totalItems")} value={data?.stats.totalItems ?? 0} />
        <StatCard label={t("home.totalLocations")} value={data?.stats.totalLocations ?? 0} />
      </View>

      <Card>
        <Card.Title title={t("home.quickActions")} />
        <Card.Content style={{ gap: 12 }}>
          <Button mode="contained" onPress={() => router.push("/item/edit")}>
            {t("home.addItem")}
          </Button>
          <Button mode="contained-tonal" onPress={() => router.push("/location/edit")}>
            {t("home.addLocation")}
          </Button>
        </Card.Content>
      </Card>

      <View style={{ gap: 12 }}>
        <Text variant="titleLarge">{t("common.favorites")}</Text>
        {data?.favorites.length ? (
          data.favorites.map((item) => (
            <ItemCard key={item.id} item={item} compact onFavoritePress={handleFavoritePress} />
          ))
        ) : (
          <EmptyState
            icon="star-outline"
            title={t("home.noFavoritesTitle")}
            description={t("home.noFavoritesDescription")}
          />
        )}
      </View>

      <View style={{ gap: 12 }}>
        <Text variant="titleLarge">{t("home.recentUpdated")}</Text>
        {data?.recentItems.length ? (
          data.recentItems.map((item) => (
            <ItemCard key={item.id} item={item} compact onFavoritePress={handleFavoritePress} />
          ))
        ) : (
          <EmptyState
            icon="archive-outline"
            title={t("home.noItemsTitle")}
            description={t("home.noItemsDescription")}
            actionLabel={t("home.addItem")}
            onActionPress={() => router.push("/item/edit")}
          />
        )}
      </View>
      <ConfirmDialog
        visible={Boolean(pendingFavoriteRemoval)}
        title={language === "ru" ? "Удалить из избранного?" : "Remove from favorites?"}
        confirmLabel={language === "ru" ? "Да" : "Yes"}
        cancelLabel={language === "ru" ? "Нет" : "No"}
        onCancel={() => setPendingFavoriteRemoval(null)}
        onConfirm={() => void handleConfirmFavoriteRemoval()}
      />
    </Screen>
  );
}
