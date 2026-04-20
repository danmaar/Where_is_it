import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

import { AppProvider } from "@/features/app/AppProvider";

function RootNavigator() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          color: theme.colors.onSurface
        },
        contentStyle: {
          backgroundColor: theme.colors.background
        }
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="location/[id]" />
      <Stack.Screen name="location/edit" />
      <Stack.Screen name="item/[id]" />
      <Stack.Screen name="item/edit" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
