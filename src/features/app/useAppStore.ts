import { create } from "zustand";

import { AppLanguage, getDefaultLanguage } from "@/i18n/core";

export type AppThemeMode = "system" | "light" | "dark";

type AppState = {
  isReady: boolean;
  revision: number;
  language: AppLanguage;
  themeMode: AppThemeMode;
  setReady: (value: boolean) => void;
  bumpRevision: () => void;
  setLanguage: (value: AppLanguage) => void;
  setThemeMode: (value: AppThemeMode) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isReady: false,
  revision: 0,
  language: getDefaultLanguage(),
  themeMode: "system",
  setReady: (value) => set({ isReady: value }),
  bumpRevision: () => set((state) => ({ revision: state.revision + 1 })),
  setLanguage: (value) => set({ language: value }),
  setThemeMode: (value) => set({ themeMode: value })
}));
