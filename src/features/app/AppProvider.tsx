import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { PaperProvider, Text } from "react-native-paper";

import { initializeDatabase } from "@/database/migrations";
import { getStoredLanguage } from "@/features/app/preferences";
import { seedDatabaseIfNeeded } from "@/database/seed";
import { useAppStore } from "@/features/app/useAppStore";
import { translate } from "@/i18n/core";
import { darkTheme, lightTheme } from "@/theme";

export const AppProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const [error, setError] = useState<string | null>(null);
  const theme = useMemo(
    () => (colorScheme === "dark" ? darkTheme : lightTheme),
    [colorScheme]
  );
  const isReady = useAppStore((state) => state.isReady);
  const setReady = useAppStore((state) => state.setReady);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initializeDatabase();
        const storedLanguage = await getStoredLanguage();
        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
        await seedDatabaseIfNeeded();
        setReady(true);
      } catch (bootstrapError) {
        const message =
          bootstrapError instanceof Error
            ? bootstrapError.message
            : translate(language, "errors.bootstrap");
        setError(message);
      }
    };

    void bootstrap();
  }, [setLanguage, setReady]);

  return (
    <PaperProvider theme={theme}>
      {!isReady ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24
          }}
        >
          <ActivityIndicator size="large" />
          {!!error && <Text style={{ marginTop: 16, textAlign: "center" }}>{error}</Text>}
        </View>
      ) : (
        children
      )}
    </PaperProvider>
  );
};
