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
  english: "Write the roast in English. IMPORTANT: Keep the English simple, direct, and easy to understand for non-native speakers. Avoid obscure cultural references or overly complex slang, but ensure it remains incredibly funny and punchy.",
  amharic: "Write the roast in Amharic using native Amharic script. IMPORTANT: You must write in absolutely perfect, flawless Amharic. Do NOT sound like a direct machine translation. Use culturally natural Ethiopian humor, tone, and expressions to make the roast hit hard.",
  tigrinya: "Write the roast in Tigrinya using native Ge'ez script.",
  "afan-oromo": "Write the roast in Afan Oromo.",
  french: "Write the roast in French.",
  italian: "Write the roast in Italian.",
};
