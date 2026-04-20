import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useFocusEffect, useLocalSearchParams, router } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import { LocationPickerField } from "@/components/forms/LocationPickerField";
import { Screen } from "@/components/Screen";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";
import { locationRepository } from "@/repositories/locationRepository";
import { LocationNode } from "@/types/entities";
import { createLocationSchema, LocationFormValues } from "@/utils/validation";

export default function EditLocationScreen() {
  const params = useLocalSearchParams<{ id?: string; parentId?: string }>();
  const locationId = typeof params.id === "string" ? params.id : undefined;
  const initialParentId = typeof params.parentId === "string" ? params.parentId : null;
  const [options, setOptions] = useState<LocationNode[]>([]);
  const bumpRevision = useAppStore((state) => state.bumpRevision);
  const { language, t } = useI18n();

  const { control, handleSubmit, reset, setValue } = useForm<LocationFormValues>({
    resolver: zodResolver(createLocationSchema(language)),
    defaultValues: {
      name: "",
      parentId: initialParentId
    }
  });

  const load = useCallback(async () => {
    const parents = await locationRepository.getSelectableParents(locationId ?? null);
    setOptions(parents);
    if (locationId) {
      const existing = await locationRepository.getById(locationId);
      if (existing) {
        reset({
          name: existing.name,
          parentId: existing.parentId
        });
      }
    } else {
      setValue("parentId", initialParentId);
    }
  }, [initialParentId, locationId, reset, setValue]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (locationId) {
        await locationRepository.update(locationId, values);
      } else {
        await locationRepository.create(values);
      }
      bumpRevision();
      router.back();
    } catch (error) {
      Alert.alert(
        t("location.saveErrorTitle"),
        error instanceof Error ? error.message : t("location.saveErrorFallback")
      );
    }
  });

  return (
    <Screen>
      <Stack.Screen options={{ title: locationId ? t("location.editTitle") : t("location.addTitle") }} />
      <Text variant="headlineSmall">{locationId ? t("location.editTitle") : t("location.addTitle")}</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            mode="outlined"
            label={t("location.nameLabel")}
            value={value}
            onChangeText={onChange}
            error={!!error}
          />
        )}
      />

      <Controller
        control={control}
        name="parentId"
        render={({ field: { onChange, value } }) => (
          <LocationPickerField
            label={t("location.parentLabel")}
            value={value}
            options={options}
            onChange={onChange}
            allowEmpty
          />
        )}
      />

      <Button mode="contained" onPress={onSubmit}>
        {t("common.save")}
      </Button>
      <Button onPress={() => router.back()}>{t("common.cancel")}</Button>
    </Screen>
  );
}
