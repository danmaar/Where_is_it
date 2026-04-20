import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

const brand = {
  primary: "#2F6B5E",
  secondary: "#8B5E3C",
  tertiary: "#3E6475"
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brand.primary,
    secondary: brand.secondary,
    tertiary: brand.tertiary,
    background: "#F6F1E8",
    surface: "#FFF8F0",
    surfaceVariant: "#E7DFD2",
    outline: "#857567"
  }
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#8FD1C2",
    secondary: "#D7B08A",
    tertiary: "#9AC8D9"
  }
};
