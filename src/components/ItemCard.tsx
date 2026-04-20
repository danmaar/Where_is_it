import { router } from "expo-router";
import { Image, View } from "react-native";
import { Card, Chip, IconButton, Text, useTheme } from "react-native-paper";

import { useI18n } from "@/i18n";
import { ItemListRow } from "@/types/entities";
import { formatQuantity } from "@/utils/format";

import { PathText } from "./PathText";

type ItemCardProps = {
  item: ItemListRow;
  compact?: boolean;
  photoPosition?: "left" | "right";
  onFavoritePress?: (item: ItemListRow) => void;
  onDecreaseQuantity?: (item: ItemListRow) => void;
  onIncreaseQuantity?: (item: ItemListRow) => void;
};

export const ItemCard = ({
  item,
  compact = false,
  photoPosition = "right",
  onFavoritePress,
  onDecreaseQuantity,
  onIncreaseQuantity
}: ItemCardProps) => {
  const { language, t } = useI18n();
  const theme = useTheme();
  const photoSize = compact ? 84 : 108;
  const rightPhotoInset = compact ? 14 : 18;
  const topPhotoInset = compact ? 38 : 44;
  const rightContentInset = photoSize + rightPhotoInset + 22;
  const photo = item.photoUri ? (
    <Image
      source={{ uri: item.photoUri }}
      style={{ width: photoSize, height: photoSize, borderRadius: 12 }}
    />
  ) : null;
  const hasQuantityControls = Boolean(onDecreaseQuantity || onIncreaseQuantity);

  return (
    <Card
      onPress={() => router.push(`/item/${item.id}`)}
      style={{ overflow: "hidden", position: "relative" }}
    >
      <View style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}>
        <IconButton
          icon={item.isFavorite ? "star" : "star-outline"}
          size={20}
          iconColor={item.isFavorite ? "#D4AF37" : undefined}
          onPress={() => onFavoritePress?.(item)}
          style={{ margin: 2 }}
        />
      </View>
      {photoPosition === "right" && photo ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: topPhotoInset,
            right: rightPhotoInset,
            width: photoSize,
            height: photoSize,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1
          }}
        >
          {photo}
        </View>
      ) : null}
      <Card.Content
        style={{
          gap: 10,
          minHeight: photoPosition === "right" && photo ? topPhotoInset + photoSize + 18 : undefined
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            paddingRight:
              photoPosition === "right" && (photo || hasQuantityControls) ? rightContentInset : 52
          }}
        >
          {photoPosition === "left" ? photo : null}
          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text variant={compact ? "titleSmall" : "titleMedium"} style={{ flex: 1 }}>
                {item.name}
              </Text>
            </View>
            <PathText path={item.locationPath} />
            {hasQuantityControls ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ opacity: 0.7 }}>
                  {t("item.quantityLabel")}:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 20,
                    paddingHorizontal: 4,
                    paddingVertical: 4,
                    backgroundColor: theme.dark ? "rgba(212, 175, 55, 0.12)" : "rgba(91, 69, 160, 0.08)"
                  }}
                >
                  <IconButton
                    icon="minus"
                    size={18}
                    mode="contained-tonal"
                    onPress={() => onDecreaseQuantity?.(item)}
                    disabled={(item.quantity ?? 0) <= 0}
                    containerColor={theme.colors.surfaceVariant}
                    iconColor={theme.colors.onSurface}
                    style={{ margin: 0 }}
                  />
                  <Text
                    variant="titleMedium"
                    style={{ minWidth: 52, textAlign: "center", opacity: 0.9 }}
                  >
                    {formatQuantity(item.quantity, language)}
                  </Text>
                  <IconButton
                    icon="plus"
                    size={18}
                    mode="contained"
                    onPress={() => onIncreaseQuantity?.(item)}
                    containerColor={theme.colors.primary}
                    iconColor={theme.colors.onPrimary}
                    style={{ margin: 0 }}
                  />
                </View>
              </View>
            ) : (
              <Text style={{ opacity: 0.7 }}>
                {t("item.quantityLabel")}: {formatQuantity(item.quantity, language)}
              </Text>
            )}
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
        </View>
      </Card.Content>
    </Card>
  );
};
