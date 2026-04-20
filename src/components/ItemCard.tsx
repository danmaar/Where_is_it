import { router } from "expo-router";
import { Image, View } from "react-native";
import { Card, Chip, IconButton, Text } from "react-native-paper";

import { useI18n } from "@/i18n";
import { ItemListRow } from "@/types/entities";
import { formatQuantity } from "@/utils/format";

import { PathText } from "./PathText";

type ItemCardProps = {
  item: ItemListRow;
  compact?: boolean;
  photoPosition?: "left" | "right";
  onFavoritePress?: (item: ItemListRow) => void;
};

export const ItemCard = ({
  item,
  compact = false,
  photoPosition = "left",
  onFavoritePress
}: ItemCardProps) => {
  const { language, t } = useI18n();
  const photo = item.photoUri ? (
    <Image
      source={{ uri: item.photoUri }}
      style={{ width: compact ? 56 : 72, height: compact ? 56 : 72, borderRadius: 12 }}
    />
  ) : null;

  return (
    <Card onPress={() => router.push(`/item/${item.id}`)}>
      <Card.Content style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {photoPosition === "left" ? photo : null}
          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text variant={compact ? "titleSmall" : "titleMedium"} style={{ flex: 1 }}>
                {item.name}
              </Text>
              <IconButton
                icon={item.isFavorite ? "star" : "star-outline"}
                size={20}
                onPress={() => onFavoritePress?.(item)}
              />
            </View>
            <PathText path={item.locationPath} />
            <Text style={{ opacity: 0.7 }}>
              {t("item.quantityLabel")}: {formatQuantity(item.quantity, language)}
            </Text>
            {item.tags.length > 0 ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {item.tags.map((tag) => (
                  <Chip key={tag} compact>
                    {tag}
                  </Chip>
                ))}
              </View>
            ) : null}
          </View>
          {photoPosition === "right" ? photo : null}
        </View>
      </Card.Content>
    </Card>
  );
};
