import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Stack, useFocusEffect, useLocalSearchParams, router } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, View } from "react-native";
import { Button, Switch, Text } from "react-native-paper";

import { FormTextField } from "@/components/forms/FormTextField";
import { LocationPickerField } from "@/components/forms/LocationPickerField";
import { Screen } from "@/components/Screen";
import { useAppStore } from "@/features/app/useAppStore";
import { useI18n } from "@/i18n";
import { itemRepository } from "@/repositories/itemRepository";
import { locationRepository } from "@/repositories/locationRepository";
import { LocationNode } from "@/types/entities";
import { createItemSchema, ItemFormValues, mapTagsTextToArray } from "@/utils/validation";

export default function EditItemScreen() {
  const params = useLocalSearchParams<{ id?: string; locationId?: string }>();
  const itemId = typeof params.id === "string" ? params.id : undefined;
  const initialLocationId = typeof params.locationId === "string" ? params.locationId : "";
  const [locations, setLocations] = useState<LocationNode[]>([]);
  const bumpRevision = useAppStore((state) => state.bumpRevision);
  const { language, t } = useI18n();

  const { control, handleSubmit, reset, setValue, watch } = useForm<ItemFormValues>({
    resolver: zodResolver(createItemSchema(language)),
    defaultValues: {
      name: "",
      locationId: initialLocationId,
      quantityText: "",
      notes: "",
      tagsText: "",
      photoUri: null,
      isFavorite: false
    }
  });

  const photoUri = watch("photoUri");

  const load = useCallback(async () => {
    setLocations(await locationRepository.getAll());
    if (itemId) {
      const existing = await itemRepository.getById(itemId);
      if (existing) {
        reset({
          name: existing.name,
          locationId: existing.locationId,
          quantityText: existing.quantity !== null ? String(existing.quantity) : "",
          notes: existing.notes ?? "",
          tagsText: existing.tags.join(", "),
          photoUri: existing.photoUri,
          isFavorite: existing.isFavorite
        });
      }
    } else {
      setValue("locationId", initialLocationId);
    }
  }, [initialLocationId, itemId, reset, setValue]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true
    });

    if (!result.canceled) {
      setValue("photoUri", result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t("item.cameraPermissionTitle"), t("item.cameraPermissionDescription"));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true
    });

    if (!result.canceled) {
      setValue("photoUri", result.assets[0].uri);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        name: values.name,
        locationId: values.locationId,
        quantity: values.quantityText ? Number(values.quantityText) : null,
        notes: values.notes?.trim() ? values.notes.trim() : null,
        tags: mapTagsTextToArray(values.tagsText),
        photoUri: values.photoUri,
        isFavorite: values.isFavorite
      };

      let resultingId = itemId;
      if (itemId) {
        await itemRepository.update(itemId, payload);
      } else {
        resultingId = await itemRepository.create(payload);
      }
      bumpRevision();
      if (resultingId) {
        router.replace(`/item/${resultingId}`);
      } else {
        router.back();
      }
    } catch (error) {
      Alert.alert(
        t("item.saveErrorTitle"),
        error instanceof Error ? error.message : t("item.saveErrorFallback")
      );
    }
  });

  return (
    <Screen>
      <Stack.Screen options={{ title: itemId ? t("item.editTitle") : t("item.addTitle") }} />
      <Text variant="headlineSmall">{itemId ? t("item.editTitle") : t("item.addTitle")}</Text>

      <FormTextField control={control} name="name" label={t("item.nameLabel")} />

      <Controller
        control={control}
        name="locationId"
        render={({ field: { onChange, value } }) => (
          <LocationPickerField
            label={t("item.locationLabel")}
            value={value}
            options={locations}
            onChange={(nextValue) => onChange(nextValue ?? "")}
          />
        )}
      />

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={{ width: "100%", height: 220, borderRadius: 16 }} />
      ) : null}
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Button mode="contained-tonal" onPress={() => void pickFromGallery()}>
          {t("item.gallery")}
        </Button>
        <Button mode="contained-tonal" onPress={() => void takePhoto()}>
          {t("item.camera")}
        </Button>
        {photoUri ? <Button onPress={() => setValue("photoUri", null)}>{t("item.removePhoto")}</Button> : null}
      </View>

      <FormTextField control={control} name="quantityText" label={t("item.quantityLabel")} keyboardType="numeric" />
      <FormTextField control={control} name="notes" label={t("item.notesLabel")} multiline />
      <FormTextField control={control} name="tagsText" label={t("item.tagsLabel")} />

      <Controller
        control={control}
        name="isFavorite"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text>{t("item.favoriteLabel")}</Text>
            <Switch value={value} onValueChange={onChange} />
          </View>
        )}
      />

      <Button mode="contained" onPress={onSubmit}>
        {t("common.save")}
      </Button>
      <Button onPress={() => router.back()}>{t("common.cancel")}</Button>
    </Screen>
  );
}
