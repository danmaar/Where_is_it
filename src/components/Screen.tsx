import { PropsWithChildren } from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: ViewStyle;
}>;

export const Screen = ({ children, scroll = true, contentStyle }: ScreenProps) => {
  const theme = useTheme();

  if (!scroll) {
    return (
      <View
        style={[
          { flex: 1, padding: 16, backgroundColor: theme.colors.background },
          contentStyle
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={[{ padding: 16, gap: 16, paddingBottom: 32 }, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
};
