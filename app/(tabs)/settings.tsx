import { useState } from "react";
import { Alert } from "react-native";
import { Button, Card, List, SegmentedButtons, Text } from "react-native-paper";

import { Screen } from "@/components/Screen";
import { exportBackup, importBackup } from "@/database/backup";
import { setStoredLanguage } from "@/features/app/preferences";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";

export default function SettingsScreen() {
  const [loading, setLoading] = useState(false);
  const bumpRevision = useAppStore((state) => state.bumpRevision);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const { language, t } = useI18n();

  const handleExport = async () => {
    setLoading(true);
    try {
      await exportBackup({ language });
      Alert.alert(t("settings.exportSuccessTitle"), t("settings.exportSuccessDescription"));
    } catch (error) {
      Alert.alert(
        t("settings.exportErrorTitle"),
        error instanceof Error ? error.message : t("settings.exportErrorFallback")
      );
    } finally {
      setLoading(false);
    }
  };

  const runImport = async (mode: "replace" | "merge") => {
    setLoading(true);
    try {
      const imported = await importBackup(mode, { language });
      if (imported) {
        bumpRevision();
        Alert.alert(
          t("settings.importSuccessTitle"),
          mode === "replace" ? t("settings.importSuccessReplace") : t("settings.importSuccessMerge")
        );
      }
    } catch (error) {
      Alert.alert(
        t("settings.importErrorTitle"),
        error instanceof Error ? error.message : t("settings.importErrorFallback")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    Alert.alert(t("settings.importPromptTitle"), t("settings.importPromptDescription"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("settings.importMerge"), onPress: () => void runImport("merge") },
      {
        text: t("settings.importReplace"),
        style: "destructive",
        onPress: () => void runImport("replace")
      }
    ]);
  };

  const handleLanguageChange = async (value: string) => {
    const nextLanguage = value as "ru" | "en";
    setLanguage(nextLanguage);
    await setStoredLanguage(nextLanguage);
  };

  return (
    <Screen>
      <Card>
        <Card.Title title={t("settings.languageTitle")} />
        <Card.Content style={{ gap: 12 }}>
          <Text>{t("settings.languageDescription")}</Text>
          <SegmentedButtons
            value={language}
            onValueChange={(value) => void handleLanguageChange(value)}
            buttons={[
              { value: "ru", label: t("settings.russian") },
              { value: "en", label: t("settings.english") }
            ]}
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Title title={t("settings.backupTitle")} />
        <Card.Content style={{ gap: 12 }}>
          <Text>{t("settings.backupDescription")}</Text>
          <Button mode="contained" onPress={handleExport} loading={loading} disabled={loading}>
            {t("settings.exportData")}
          </Button>
          <Button mode="contained-tonal" onPress={handleImport} loading={loading} disabled={loading}>
            {t("settings.importData")}
          </Button>
        </Card.Content>
      </Card>

      <Card>
        <Card.Title title={t("settings.aboutTitle")} />
        <Card.Content>
          <List.Item
            title={t("settings.aboutAppTitle")}
            description={t("settings.aboutAppDescription")}
            left={(props) => <List.Icon {...props} icon="information-outline" />}
          />
          <List.Item
            title={t("settings.aboutStorageTitle")}
            description={t("settings.aboutStorageDescription")}
            left={(props) => <List.Icon {...props} icon="database-outline" />}
          />
          <List.Item
            title={t("settings.aboutPlatformTitle")}
            description={t("settings.aboutPlatformDescription")}
            left={(props) => <List.Icon {...props} icon="android" />}
          />
        </Card.Content>
      </Card>
    </Screen>
  );
}
