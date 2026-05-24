"use client";

import {
  INTENSITY_LEVELS,
  IntensityLevel,
} from "@/lib/prompts";
import { useUiLanguage } from "@/components/UiLanguageProvider";
import { translate, type TranslationKey } from "@/lib/translations";

const INTENSITY_LABEL_KEYS: Record<IntensityLevel, TranslationKey> = {
  mild: "intensityLabel.mild",
  medium: "intensityLabel.medium",
  savage: "intensityLabel.savage",
  poetic: "intensityLabel.poetic",
};

const INTENSITY_DESC_KEYS: Record<IntensityLevel, TranslationKey> = {
  mild: "intensityDesc.mild",
  medium: "intensityDesc.medium",
  savage: "intensityDesc.savage",
  poetic: "intensityDesc.poetic",
};

interface IntensitySliderProps {
  intensity: IntensityLevel;
  onIntensityChange: (intensity: IntensityLevel) => void;
}

export default function IntensitySlider({
  intensity,
  onIntensityChange,
}: IntensitySliderProps) {
  const { lang } = useUiLanguage();

  return (
    <div className="w-full">
      <label className="mb-3 block text-sm font-semibold tracking-wide text-slate-200">
        {translate("slider.roastIntensity", lang)}
      </label>
      <div className="flex flex-wrap gap-2">
        {INTENSITY_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => onIntensityChange(level)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              intensity === level
                ? "bg-emerald-600 text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)]"
                : "bg-slate-900/60 text-slate-200 ring-1 ring-slate-500/70 hover:bg-slate-800"
            }`}
            title={translate(INTENSITY_DESC_KEYS[level], lang)}
          >
            {translate(INTENSITY_LABEL_KEYS[level], lang)}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">{translate(INTENSITY_DESC_KEYS[intensity], lang)}</p>
    </div>
  );
}
