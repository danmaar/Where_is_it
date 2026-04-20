import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

import { useI18n } from "@/i18n";

export default function TabsLayout() {
  const { t } = useI18n();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "left",
        headerStyle: {
          backgroundColor: theme.colors.surface
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          color: theme.colors.onSurface
        },
        sceneStyle: {
          backgroundColor: theme.colors.background
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant
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
        name="locations/index"
        options={{
          title: t("navigation.locations"),
          headerTitle: t("navigation.locations"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="folder-marker-outline" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="items/index"
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
