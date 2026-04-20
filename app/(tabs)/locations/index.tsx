import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { FAB, Text } from "react-native-paper";

import { EmptyState } from "@/components/EmptyState";
import { LocationTree } from "@/components/LocationTree";
import { Screen } from "@/components/Screen";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";
import { locationRepository } from "@/repositories/locationRepository";
import { LocationNode } from "@/types/entities";

export default function LocationsScreen() {
  const [locations, setLocations] = useState<LocationNode[]>([]);
  const revision = useAppStore((state) => state.revision);
  const { t } = useI18n();

  const load = useCallback(async () => {
    setLocations(await locationRepository.getAll());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load, revision])
  );

  return (
    <>
      <Screen>
        <Text variant="bodyLarge" style={{ opacity: 0.75 }}>
          {t("locations.intro")}
        </Text>
        {locations.length ? (
          <LocationTree locations={locations} />
        ) : (
          <EmptyState
            icon="folder-plus-outline"
            title={t("locations.emptyTitle")}
            description={t("locations.emptyDescription")}
            actionLabel={t("home.addLocation")}
            onActionPress={() => router.push("/location/edit")}
          />
        )}
      </Screen>
      <FAB
        icon="plus"
        label={t("common.add")}
        style={{ position: "absolute", right: 16, bottom: 16 }}
        onPress={() => router.push("/location/edit")}
      />
    </>
  );
}
