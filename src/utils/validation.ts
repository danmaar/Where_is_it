import { z } from "zod";

import { AppLanguage, translate } from "@/i18n/core";
import { parseTags, sanitizeName } from "@/utils/format";

const createRequiredName = (language: AppLanguage) =>
  z
    .string()
    .transform((value) => sanitizeName(value))
    .refine((value) => value.length > 0, translate(language, "validation.required"));

export const createLocationSchema = (language: AppLanguage) =>
  z.object({
    name: createRequiredName(language),
    parentId: z.string().nullable()
  });

export const createItemSchema = (language: AppLanguage) =>
  z.object({
    name: createRequiredName(language),
    locationId: z.string().min(1, translate(language, "validation.selectLocation")),
    quantityText: z
      .string()
      .optional()
      .transform((value) => (value ?? "").trim())
      .refine(
        (value) => value === "" || /^\d+$/.test(value),
        translate(language, "validation.wholeNumber")
      ),
    notes: z.string().optional(),
    tagsText: z.string().optional(),
    photoUri: z.string().nullable(),
    isFavorite: z.boolean()
  });

export const backupSchema = z.object({
  version: z.number().int().positive(),
  exportedAt: z.string(),
  locations: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      parentId: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string()
    })
  ),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      locationId: z.string(),
      photoUri: z.string().nullable(),
      quantity: z.number().nullable(),
      notes: z.string().nullable(),
      isFavorite: z.number().int(),
      createdAt: z.string(),
      updatedAt: z.string()
    })
  ),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string()
    })
  ),
  itemTags: z.array(
    z.object({
      itemId: z.string(),
      tagId: z.string()
    })
  ),
  recentSearches: z.array(
    z.object({
      id: z.string(),
      query: z.string(),
      createdAt: z.string()
    })
  )
});

export type ItemFormValues = z.infer<ReturnType<typeof createItemSchema>>;
export type LocationFormValues = z.infer<ReturnType<typeof createLocationSchema>>;

export const mapTagsTextToArray = (value?: string) => parseTags(value ?? "");
