import { ObjectId } from "mongodb";
import { IntensityLevel } from "@/lib/prompts";
import { RoastLanguage } from "@/lib/languages";

export const COLLECTIONS = {
  userProfiles: "userProfiles",
  roastHistory: "roastHistory",
  exports: "exports",
} as const;

export type UserPlan = "free" | "pro" | "team";

export interface UserPreferences {
  defaultIntensity: IntensityLevel;
  defaultLanguage: RoastLanguage;
  theme: "dark" | "light" | "system";
}

export interface UserProfile {
  _id?: ObjectId;
  userId: string;
  name?: string;
  bio: string;
  avatar: string;
  plan: UserPlan;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoastHistory {
  _id?: ObjectId;
  userId: string;
  imageRef?: string;
  imageHash: string;
  roastText: string;
  intensity: IntensityLevel;
  language: RoastLanguage;
  createdAt: Date;
}

export interface ExportFileMeta {
  fileName?: string;
  mimeType?: string;
  bytes?: number;
}

export interface RoastExport {
  _id?: ObjectId;
  userId: string;
  roastHistoryId?: ObjectId;
  sizePreset: "1080x1350" | "1080x1920" | "custom";
  url?: string;
  fileMeta?: ExportFileMeta;
  createdAt: Date;
}

export function createDefaultUserProfile(userId: string): UserProfile {
  const now = new Date();
  return {
    userId,
    name: "",
    bio: "",
    avatar: "",
    plan: "free",
    preferences: {
      defaultIntensity: "medium",
      defaultLanguage: "english",
      theme: "system",
    },
    createdAt: now,
    updatedAt: now,
  };
}
