import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

type EmptyStateProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onActionPress
}: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        borderRadius: 24,
        backgroundColor: theme.colors.surfaceVariant,
        gap: 8
      }}
    >
      <MaterialCommunityIcons name={icon} size={40} color={theme.colors.onSurfaceVariant} />
      <Text variant="titleMedium">{title}</Text>
      <Text style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>{description}</Text>
      {actionLabel && onActionPress ? (
        <Button mode="contained-tonal" onPress={onActionPress} style={{ marginTop: 8 }}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
};
