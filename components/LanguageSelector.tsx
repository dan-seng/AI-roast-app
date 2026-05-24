"use client";

import {
  ROAST_LANGUAGE_LABELS,
  ROAST_LANGUAGES,
  RoastLanguage,
} from "@/lib/languages";
import { useUiLanguage } from "@/components/UiLanguageProvider";
import { translate } from "@/lib/translations";

interface LanguageSelectorProps {
  language: RoastLanguage;
  onLanguageChange: (language: RoastLanguage) => void;
}

export default function LanguageSelector({
  language,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { lang } = useUiLanguage();

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-200">
        {translate("slider.roastLanguage", lang)}
      </label>
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value as RoastLanguage)}
        className="w-full rounded-xl border border-slate-500/70 bg-slate-950/65 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-900/50"
      >
        {ROAST_LANGUAGES.map((option) => (
          <option key={option} value={option} className="bg-slate-900 text-slate-100">
            {ROAST_LANGUAGE_LABELS[option]}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-slate-400">
        {translate("home.roastLangDesc", lang)}
      </p>
    </div>
  );
}
