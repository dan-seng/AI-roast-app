export const ROAST_LANGUAGES = [
  "english",
  "amharic",
  "tigrinya",
  "afan-oromo",
  "french",
  "italian",
] as const;

export type RoastLanguage = (typeof ROAST_LANGUAGES)[number];

export const ROAST_LANGUAGE_LABELS: Record<RoastLanguage, string> = {
  english: "English",
  amharic: "Amharic",
  tigrinya: "Tigrinya",
  "afan-oromo": "Afan Oromo",
  french: "French",
  italian: "Italian",
};

export const ROAST_LANGUAGE_INSTRUCTIONS: Record<RoastLanguage, string> = {
  english: "Write the roast in English.",
  amharic: "Write the roast in Amharic using native Amharic script.",
  tigrinya: "Write the roast in Tigrinya using native Ge'ez script.",
  "afan-oromo": "Write the roast in Afan Oromo.",
  french: "Write the roast in French.",
  italian: "Write the roast in Italian.",
};
