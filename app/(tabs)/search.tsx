import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Card, List, Text } from "react-native-paper";

import { EmptyState } from "@/components/EmptyState";
import { ItemCard } from "@/components/ItemCard";
import { Screen } from "@/components/Screen";
import { SearchBarCard } from "@/components/SearchBarCard";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";
import { itemRepository } from "@/repositories/itemRepository";
import { searchRepository } from "@/repositories/searchRepository";
import { ItemListRow, RecentSearchEntity } from "@/types/entities";

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(typeof params.q === "string" ? params.q : "");
  const [results, setResults] = useState<ItemListRow[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearchEntity[]>([]);
  const revision = useAppStore((state) => state.revision);
  const bumpRevision = useAppStore((state) => state.bumpRevision);
  const { t } = useI18n();

  const loadRecent = useCallback(async () => {
    setRecentSearches(await searchRepository.getRecentSearches());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRecent();
    }, [loadRecent, revision])
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const runSearch = async () => {
        if (!query.trim()) {
          setResults([]);
          return;
        }

        const found = await searchRepository.searchItems(query);
        setResults(found);
      };

      void runSearch();
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleOpenRecent = async (value: string) => {
    setQuery(value);
    await searchRepository.addRecentSearch(value);
    setRecentSearches(await searchRepository.getRecentSearches());
  };

  const handleFavoritePress = async (item: ItemListRow) => {
    await itemRepository.toggleFavorite(item.id, !item.isFavorite);
    bumpRevision();
    setResults(await searchRepository.searchItems(query));
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      return;
    }

    await searchRepository.addRecentSearch(query);
    setRecentSearches(await searchRepository.getRecentSearches());
    setResults(await searchRepository.searchItems(query));
  };

  const handleClearRecent = () => {
    Alert.alert(t("search.clearHistoryTitle"), t("search.clearHistoryDescription"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.clear"),
        style: "destructive",
        onPress: async () => {
          await searchRepository.clearRecentSearches();
          setRecentSearches([]);
        }
      }
    ]);
  };

  return (
    <Screen>
      <SearchBarCard
        value={query}
        onChangeText={setQuery}
        autoFocus
        placeholder={t("search.placeholder")}
      />
      <Button mode="contained" onPress={handleSubmit}>
        {t("common.find")}
      </Button>

      {query.trim() ? (
        results.length ? (
          <View style={{ gap: 12 }}>
            <Text variant="titleMedium">{t("search.results")}</Text>
            {results.map((item) => (
              <ItemCard key={item.id} item={item} onFavoritePress={handleFavoritePress} />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="magnify-remove-outline"
            title={t("search.noResultsTitle")}
            description={t("search.noResultsDescription")}
          />
        )
      ) : (
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text variant="titleMedium">{t("search.recentSearches")}</Text>
            {recentSearches.length ? <Button onPress={handleClearRecent}>{t("common.clear")}</Button> : null}
          </View>
          {recentSearches.length ? (
            <Card>
              <Card.Content>
                {recentSearches.map((entry) => (
                  <List.Item
                    key={entry.id}
                    title={entry.query}
                    left={(props) => <List.Icon {...props} icon="history" />}
                    onPress={() => void handleOpenRecent(entry.query)}
                  />
                ))}
              </Card.Content>
            </Card>
          ) : (
            <EmptyState
              icon="history"
              title={t("search.emptyRecentTitle")}
              description={t("search.emptyRecentDescription")}
            />
          )}
        </View>
      )}
    </Screen>
  );
}
