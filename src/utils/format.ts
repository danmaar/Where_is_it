import { AppLanguage, getLocaleTag, translate } from "@/i18n/core";

export const formatDateTime = (value: string, language: AppLanguage) => {
  try {
    return new Intl.DateTimeFormat(getLocaleTag(language), {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export const formatQuantity = (value: number | null, language: AppLanguage) => {
  if (value === null || Number.isNaN(value)) {
    return translate(language, "formatting.unspecified");
  }

  return translate(language, "formatting.pieces", { value });
};

export const sanitizeName = (value: string) => value.trim().replace(/\s+/g, " ");

export const parseTags = (value: string) =>
  Array.from(
    new Set(
      value
        .split(",")
        .map((tag) => sanitizeName(tag))
        .filter(Boolean)
    )
  );
