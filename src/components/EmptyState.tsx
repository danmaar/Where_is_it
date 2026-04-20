import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

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
}: EmptyStateProps) => (
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      borderRadius: 24,
      backgroundColor: "rgba(0,0,0,0.03)",
      gap: 8
    }}
  >
    <MaterialCommunityIcons name={icon} size={40} color="#6F665E" />
    <Text variant="titleMedium">{title}</Text>
    <Text style={{ textAlign: "center", opacity: 0.75 }}>{description}</Text>
    {actionLabel && onActionPress ? (
      <Button mode="contained-tonal" onPress={onActionPress} style={{ marginTop: 8 }}>
        {actionLabel}
      </Button>
    ) : null}
  </View>
);
