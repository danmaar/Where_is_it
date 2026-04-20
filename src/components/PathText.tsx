import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

export const PathText = ({ path }: { path: string }) => (
  <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
    <MaterialCommunityIcons name="map-marker-path" size={18} color="#6B655F" />
    <Text style={{ flex: 1, opacity: 0.85 }}>{path}</Text>
  </View>
);
