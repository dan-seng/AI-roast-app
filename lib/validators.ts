import { z } from "zod";
import { INTENSITY_LEVELS } from "@/lib/prompts";
import { ROAST_LANGUAGES } from "@/lib/languages";

export const roastRequestSchema = z.object({
  image: z.string().min(1),
  intensity: z.enum(INTENSITY_LEVELS),
  language: z.enum(ROAST_LANGUAGES).default("english"),
  userDefense: z.string().max(600).optional().default(""),
});

export const profilePatchSchema = z.object({
  name: z.string().max(80).optional(),
  bio: z.string().max(280).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  plan: z.enum(["free", "pro", "team"]).optional(),
  preferences: z
    .object({
      defaultIntensity: z.enum(INTENSITY_LEVELS).optional(),
      defaultLanguage: z.enum(ROAST_LANGUAGES).optional(),
      theme: z.enum(["dark", "light", "system"]).optional(),
    })
    .optional(),
});

export const exportsPostSchema = z.object({
  roastHistoryId: z.string().optional(),
  sizePreset: z.enum(["1080x1350", "1080x1920", "custom"]),
  url: z.string().url().optional(),
  fileMeta: z
    .object({
      fileName: z.string().optional(),
      mimeType: z.string().optional(),
      bytes: z.number().int().nonnegative().optional(),
    })
    .optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
