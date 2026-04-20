import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export const PathText = ({ path }: { path: string }) => {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <MaterialCommunityIcons name="map-marker-path" size={18} color={theme.colors.onSurfaceVariant} />
      <Text style={{ flex: 1, color: theme.colors.onSurfaceVariant }}>{path}</Text>
    </View>
  );
};
