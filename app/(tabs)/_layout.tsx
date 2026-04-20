import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useI18n } from "@/i18n";

export default function TabsLayout() {
  const { t } = useI18n();

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "left",
        tabBarActiveTintColor: "#2F6B5E"
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("navigation.home"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("navigation.search"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: t("navigation.locations"),
          headerTitle: t("navigation.locations"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder-marker-outline" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: t("navigation.items"),
          headerTitle: t("navigation.items"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="archive-outline" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("navigation.settings"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
          )
        }}
      />
    </Tabs>
  );
}
