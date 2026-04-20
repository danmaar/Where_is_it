import { Stack, router } from "expo-router";
import { Button, Text } from "react-native-paper";

import { Screen } from "@/components/Screen";
import { useI18n } from "@/i18n";

export default function NotFoundScreen() {
  const { t } = useI18n();

  return (
    <>
      <Stack.Screen options={{ title: t("notFound.title") }} />
      <Screen>
        <Text variant="headlineSmall">{t("notFound.heading")}</Text>
        <Button mode="contained" onPress={() => router.replace("/")}>
          {t("notFound.action")}
        </Button>
      </Screen>
    </>
  );
}
