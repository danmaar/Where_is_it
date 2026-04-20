import { Stack, useFocusEffect, useLocalSearchParams, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, View } from "react-native";
import { Button, Card, List, Text, useTheme } from "react-native-paper";

import { EmptyState } from "@/components/EmptyState";
import { PathText } from "@/components/PathText";
import { Screen } from "@/components/Screen";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";
import { locationRepository } from "@/repositories/locationRepository";
import { LocationDetails } from "@/types/entities";

export default function LocationDetailsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const bumpRevision = useAppStore((state) => state.bumpRevision);
  const revision = useAppStore((state) => state.revision);
  const { t } = useI18n();

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setLocation(await locationRepository.getDetails(id));
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

    Alert.alert(t("location.deleteConfirmTitle"), t("location.deleteConfirmDescription"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await locationRepository.delete(id);
            bumpRevision();
            router.back();
          } catch (error) {
            Alert.alert(
              t("location.deleteImpossibleTitle"),
              error instanceof Error ? error.message : t("location.saveErrorFallback")
            );
          }
        }
      }
    ]);
  };

  if (!location) {
    return (
      <Screen>
        <Stack.Screen options={{ title: t("location.missingTitle") }} />
        <EmptyState
          icon="folder-remove-outline"
          title={t("location.missingTitle")}
          description={t("location.missingDescription")}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: location.name }} />
      <Card>
        <Card.Content style={{ gap: 12 }}>
          {location.photoUri ? (
            <Image
              source={{ uri: location.photoUri }}
              style={{ width: "100%", height: 220, borderRadius: 18 }}
            />
          ) : null}
          <Text variant="headlineSmall">{location.name}</Text>
          <PathText path={location.path} />
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <Button
              mode="contained"
              onPress={() => router.push({ pathname: "/item/edit", params: { locationId: location.id } })}
            >
              {t("home.addItem")}
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => router.push({ pathname: "/location/edit", params: { parentId: location.id } })}
            >
              {t("locations.addNested")}
            </Button>
          </View>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <Button onPress={() => router.push({ pathname: "/location/edit", params: { id: location.id } })}>
              {t("common.edit")}
            </Button>
            <Button textColor={theme.colors.error} onPress={handleDelete}>
              {t("common.delete")}
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View style={{ gap: 12 }}>
        <Text variant="titleLarge">{t("locations.nestedLocations")}</Text>
        {location.childLocations.length ? (
          <Card>
            <Card.Content>
              {location.childLocations.map((child) => (
                <List.Item
                  key={child.id}
                  title={child.name}
                  description={child.path}
                  right={(props) => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <List.Icon {...props} icon="folder-outline" />
                      <List.Icon {...props} icon="chevron-right" />
                    </View>
                  )}
                  onPress={() => router.push(`/location/${child.id}`)}
                />
              ))}
            </Card.Content>
          </Card>
        ) : (
          <EmptyState
            icon="folder-outline"
            title={t("locations.nestedEmptyTitle")}
            description={t("locations.nestedEmptyDescription")}
          />
        )}
      </View>

      <View style={{ gap: 12 }}>
        <Text variant="titleLarge">{t("locations.itemsHere")}</Text>
        {location.directItems.length ? (
          <Card>
            <Card.Content>
              {location.directItems.map((item) => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  description={item.tags.length ? item.tags.join(", ") : t("locations.noTags")}
                  right={(props) => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <List.Icon {...props} icon="archive-outline" />
                      <List.Icon {...props} icon="chevron-right" />
                    </View>
                  )}
                  onPress={() => router.push(`/item/${item.id}`)}
                />
              ))}
            </Card.Content>
          </Card>
        ) : (
          <EmptyState
            icon="archive-outline"
            title={t("locations.itemsEmptyTitle")}
            description={t("locations.itemsEmptyDescription")}
            actionLabel={t("home.addItem")}
            onActionPress={() => router.push({ pathname: "/item/edit", params: { locationId: location.id } })}
          />
        )}
      </View>
    </Screen>
  );
}
