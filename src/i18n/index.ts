import { useAppStore } from "@/features/app/useAppStore";

export * from "./core";

import { translate } from "./core";
import { getLocaleTag } from "./core";

export const useI18n = () => {
  const language = useAppStore((state) => state.language);

  return {
    language,
    locale: getLocaleTag(language),
    t: (key: string, params?: Record<string, string | number | boolean | null | undefined>) =>
      translate(language, key, params)
  };
};
