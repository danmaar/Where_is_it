import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme
} from "@react-navigation/native";

import { AppThemeMode } from "@/features/app/useAppStore";

const brand = {
  primary: "#2F6B5E",
  secondary: "#8B5E3C",
  tertiary: "#3E6475"
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: brand.primary,
    secondary: brand.secondary,
    tertiary: brand.tertiary,
    background: "#F6F1E8",
    surface: "#FFF8F0",
    surfaceVariant: "#E7DFD2",
    outline: "#857567",
    outlineVariant: "#B2A494"
  }
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#8FD1C2",
    secondary: "#D7B08A",
    tertiary: "#9AC8D9",
    background: "#111412",
    surface: "#181C19",
    surfaceVariant: "#26312D",
    outline: "#8B938D",
    outlineVariant: "#414944",
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: "#111412",
      level1: "#1D2320",
      level2: "#202723",
      level3: "#252D28",
      level4: "#27302B",
      level5: "#2B352F"
    }
  }
};

const { LightTheme: navigationLightTheme, DarkTheme: navigationDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationLightTheme,
  reactNavigationDark: NavigationDarkTheme,
  materialLight: lightTheme,
  materialDark: darkTheme
});

export const themes = {
  light: { paper: lightTheme, navigation: navigationLightTheme },
  dark: { paper: darkTheme, navigation: navigationDarkTheme }
};

export const resolveThemeMode = (
  themeMode: AppThemeMode,
  systemColorScheme: "light" | "dark" | null | undefined
) => {
  if (themeMode === "system") {
    return systemColorScheme === "dark" ? "dark" : "light";
  }

  return themeMode;
};
