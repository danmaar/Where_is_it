import { Pressable } from "react-native";
import { Searchbar } from "react-native-paper";

import { useI18n } from "@/i18n";

type SearchBarCardProps = {
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  onChangeText?: (value: string) => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
};

export const SearchBarCard = ({
  value = "",
  placeholder,
  onPress,
  onChangeText,
  onSubmit,
  autoFocus
}: SearchBarCardProps) => {
  const { t } = useI18n();
  const resolvedPlaceholder = placeholder ?? t("search.searchBarPlaceholder");

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        <Searchbar
          value={value}
          placeholder={resolvedPlaceholder}
          editable={false}
          pointerEvents="none"
          style={{ borderRadius: 20 }}
        />
      </Pressable>
    );
  }

  return (
    <Searchbar
      value={value}
      placeholder={resolvedPlaceholder}
      onChangeText={onChangeText}
      onIconPress={onSubmit}
      onSubmitEditing={() => onSubmit?.()}
      returnKeyType="search"
      autoFocus={autoFocus}
      style={{ borderRadius: 20 }}
    />
  );
};
