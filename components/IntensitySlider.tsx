"use client";

import {
  INTENSITY_DESCRIPTIONS,
  INTENSITY_LABELS,
  INTENSITY_LEVELS,
  IntensityLevel,
} from "@/lib/prompts";

interface IntensitySliderProps {
  intensity: IntensityLevel;
  onIntensityChange: (intensity: IntensityLevel) => void;
}

export default function IntensitySlider({
  intensity,
  onIntensityChange,
}: IntensitySliderProps) {
  return (
    <div className="w-full">
      <label className="mb-3 block text-sm font-semibold tracking-wide text-slate-200">
        Roast Intensity
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
            title={INTENSITY_DESCRIPTIONS[level]}
          >
            {INTENSITY_LABELS[level]}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">{INTENSITY_DESCRIPTIONS[intensity]}</p>
    </div>
  );
}
