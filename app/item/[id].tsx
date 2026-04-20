import { Stack, useFocusEffect, useLocalSearchParams, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, View } from "react-native";
import { Button, Card, Chip, Switch, Text } from "react-native-paper";

import { EmptyState } from "@/components/EmptyState";
import { PathText } from "@/components/PathText";
import { Screen } from "@/components/Screen";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";
import { itemRepository } from "@/repositories/itemRepository";
import { ItemDetails } from "@/types/entities";
import { formatDateTime, formatQuantity } from "@/utils/format";

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<ItemDetails | null>(null);
  const revision = useAppStore((state) => state.revision);
  const bumpRevision = useAppStore((state) => state.bumpRevision);
  const { language, t } = useI18n();

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setItem(await itemRepository.getById(id));
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load, revision])
  );

  const handleDelete = () => {
    if (!id) {
      return;
    }

    Alert.alert(t("item.deleteConfirmTitle"), t("item.deleteConfirmDescription"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          await itemRepository.delete(id);
          bumpRevision();
          router.back();
        }
      }
    ]);
  };

  const handleFavoriteToggle = async (value: boolean) => {
    if (!item) {
      return;
    }

    await itemRepository.toggleFavorite(item.id, value);
    bumpRevision();
    setItem(await itemRepository.getById(item.id));
  };

  if (!item) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t("item.missingTitle") }} />
        <EmptyState
          icon="archive-remove-outline"
          title={t("item.missingTitle")}
          description={t("item.missingDescription")}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: item.name }} />
      <Card>
        <Card.Content style={{ gap: 12 }}>
          {item.photoUri ? (
            <Image
              source={{ uri: item.photoUri }}
              style={{ width: "100%", height: 220, borderRadius: 18 }}
            />
          ) : null}
          <Text variant="headlineSmall">{item.name}</Text>
          <PathText path={item.locationPath} />
          <Text>
            {t("item.quantityLabel")}: {formatQuantity(item.quantity, language)}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text>{t("item.favoriteLabel")}</Text>
            <Switch value={item.isFavorite} onValueChange={handleFavoriteToggle} />
          </View>
          {item.notes ? <Text>{t("item.notesLabel")}: {item.notes}</Text> : null}
          {item.tags.length ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {item.tags.map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </View>
          ) : null}
          <Text style={{ opacity: 0.7 }}>
            {t("item.createdAt", { value: formatDateTime(item.createdAt, language) })}
          </Text>
          <Text style={{ opacity: 0.7 }}>
            {t("item.updatedAt", { value: formatDateTime(item.updatedAt, language) })}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <Button mode="contained" onPress={() => router.push({ pathname: "/item/edit", params: { id: item.id } })}>
              {t("common.edit")}
            </Button>
            <Button textColor="#B3261E" onPress={handleDelete}>
              {t("common.delete")}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Screen>
  );
}
