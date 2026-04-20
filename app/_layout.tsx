import { Stack } from "expo-router";

import { AppProvider } from "@/features/app/AppProvider";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="location/[id]" />
        <Stack.Screen name="location/edit" />
        <Stack.Screen name="item/[id]" />
        <Stack.Screen name="item/edit" />
      </Stack>
    </AppProvider>
  );
}
