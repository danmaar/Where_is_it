import { create } from "zustand";

import { AppLanguage, getDefaultLanguage } from "@/i18n/core";

type AppState = {
  isReady: boolean;
  revision: number;
  language: AppLanguage;
  setReady: (value: boolean) => void;
  bumpRevision: () => void;
  setLanguage: (value: AppLanguage) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isReady: false,
  revision: 0,
  language: getDefaultLanguage(),
  setReady: (value) => set({ isReady: value }),
  bumpRevision: () => set((state) => ({ revision: state.revision + 1 })),
  setLanguage: (value) => set({ language: value })
}));
