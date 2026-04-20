import { router } from "expo-router";
import { Image, View } from "react-native";
import { Card, Text } from "react-native-paper";

import { useI18n } from "@/i18n";
import { LocationNode } from "@/types/entities";

import { PathText } from "./PathText";

export const LocationCard = ({ location }: { location: LocationNode }) => {
  const { t } = useI18n();

  return (
    <Card onPress={() => router.push(`/location/${location.id}`)}>
      <Card.Content style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {location.photoUri ? (
            <Image source={{ uri: location.photoUri }} style={{ width: 64, height: 64, borderRadius: 12 }} />
          ) : null}
          <View style={{ flex: 1, gap: 8 }}>
            <View style={{ paddingLeft: location.depth * 12 }}>
              <Text variant="titleMedium">{location.name}</Text>
            </View>
            <PathText path={location.path} />
            <Text style={{ opacity: 0.7 }}>
              {t("locations.cardSummary", {
                childCount: location.childCount,
                itemCount: location.itemCount
              })}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};
