import { Pressable } from "react-native";
import { Searchbar } from "react-native-paper";

import { useI18n } from "@/i18n";

type SearchBarCardProps = {
  value?: string;
  placeholder?: string;
  onPress?: () => void;
  onChangeText?: (value: string) => void;
  autoFocus?: boolean;
};

export const SearchBarCard = ({
  value = "",
  placeholder,
  onPress,
  onChangeText,
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
      autoFocus={autoFocus}
      style={{ borderRadius: 20 }}
    />
  );
};
