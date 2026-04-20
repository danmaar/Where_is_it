import { PropsWithChildren } from "react";
import { ScrollView, View, ViewStyle } from "react-native";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: ViewStyle;
}>;

export const Screen = ({ children, scroll = true, contentStyle }: ScreenProps) => {
  if (!scroll) {
    return <View style={[{ flex: 1, padding: 16 }, contentStyle]}>{children}</View>;
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[{ padding: 16, gap: 16, paddingBottom: 32 }, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
};
