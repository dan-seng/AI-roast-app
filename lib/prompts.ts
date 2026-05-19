export const INTENSITY_LEVELS = ['mild', 'medium', 'savage', 'poetic'] as const;

export type IntensityLevel = (typeof INTENSITY_LEVELS)[number];

export const INTENSITY_LABELS: Record<IntensityLevel, string> = {
  mild: 'Mild',
  medium: 'Medium',
  savage: 'Savage',
  poetic: 'Poetic',
};

export const INTENSITY_DESCRIPTIONS: Record<IntensityLevel, string> = {
  mild: 'Gentle and playful',
  medium: 'Witty and clever',
  savage: 'Brutally honest',
  poetic: 'Beautifully cutting',
};
