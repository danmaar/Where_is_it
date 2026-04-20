import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StatusBar, View, useColorScheme } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { PaperProvider, Text } from "react-native-paper";

import { initializeDatabase } from "@/database/migrations";
import { getStoredLanguage, getStoredThemeMode } from "@/features/app/preferences";
import { seedDatabaseIfNeeded } from "@/database/seed";
import { useAppStore } from "@/features/app/useAppStore";
import { translate } from "@/i18n/core";
import { resolveThemeMode, themes } from "@/theme";

export const AppProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const [error, setError] = useState<string | null>(null);
  const isReady = useAppStore((state) => state.isReady);
  const setReady = useAppStore((state) => state.setReady);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const themeMode = useAppStore((state) => state.themeMode);
  const activeThemeMode = resolveThemeMode(themeMode, colorScheme);
  const theme = useMemo(() => themes[activeThemeMode], [activeThemeMode]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initializeDatabase();
        const [storedLanguage, storedThemeMode] = await Promise.all([
          getStoredLanguage(),
          getStoredThemeMode()
        ]);

        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
        if (storedThemeMode) {
          setThemeMode(storedThemeMode);
        }
        await seedDatabaseIfNeeded();
        setReady(true);
      } catch (bootstrapError) {
        const currentLanguage = useAppStore.getState().language;
        const message =
          bootstrapError instanceof Error
            ? bootstrapError.message
            : translate(currentLanguage, "errors.bootstrap");
        setError(message);
      }
    };

    void bootstrap();
  }, [setLanguage, setReady, setThemeMode]);

  return (
    <ThemeProvider value={theme.navigation}>
      <PaperProvider theme={theme.paper}>
        <StatusBar
          barStyle={activeThemeMode === "dark" ? "light-content" : "dark-content"}
          backgroundColor={theme.paper.colors.background}
        />
        {!isReady ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              backgroundColor: theme.paper.colors.background
            }}
          >
            <ActivityIndicator size="large" color={theme.paper.colors.primary} />
            {!!error && (
              <Text style={{ marginTop: 16, textAlign: "center", color: theme.paper.colors.onBackground }}>
                {error}
              </Text>
            )}
          </View>
        ) : (
          children
        )}
      </PaperProvider>
    </ThemeProvider>
  );
};
