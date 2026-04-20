import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Button, Dialog, Portal, RadioButton, Text, useTheme } from "react-native-paper";

import { useI18n } from "@/i18n";
import { LocationNode } from "@/types/entities";

type LocationPickerFieldProps = {
  label: string;
  value: string | null;
  options: LocationNode[];
  onChange: (value: string | null) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
};

export const LocationPickerField = ({
  label,
  value,
  options,
  onChange,
  allowEmpty = false,
  emptyLabel
}: LocationPickerFieldProps) => {
  const { t } = useI18n();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const resolvedEmptyLabel = emptyLabel ?? t("location.emptyParent");
  const current = options.find((option) => option.id === value);

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.outline,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            gap: 6
          }}
        >
          <Text variant="labelLarge">{label}</Text>
          <Text style={{ color: theme.colors.onSurface }}>{current?.path ?? resolvedEmptyLabel}</Text>
        </View>
      </Pressable>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>{label}</Dialog.Title>
          <Dialog.ScrollArea style={{ maxHeight: 420 }}>
            <FlatList
              data={allowEmpty ? [{ id: "", path: resolvedEmptyLabel }, ...options] : options}
              keyExtractor={(item) => item.id || "empty"}
              renderItem={({ item }) => {
                const isEmpty = item.id === "";
                const selected = (value ?? "") === item.id;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(isEmpty ? null : item.id);
                      setVisible(false);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 10,
                      gap: 12
                    }}
                  >
                    <RadioButton value={item.id} status={selected ? "checked" : "unchecked"} />
                    <Text style={{ flex: 1 }}>{item.path}</Text>
                  </Pressable>
                );
              }}
            />
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>{t("common.cancel")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
