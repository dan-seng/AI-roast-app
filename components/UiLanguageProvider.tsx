"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type UiLanguage } from "@/lib/translations";

interface UiLanguageContextType {
  lang: UiLanguage;
  setLang: (lang: UiLanguage) => void;
}

const UiLanguageContext = createContext<UiLanguageContextType | null>(null);

export function UiLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UiLanguage>("eng");

  useEffect(() => {
    const stored = localStorage.getItem("kuknis_ui_lang") as UiLanguage | null;
    if (stored === "eng" || stored === "amh") {
      setLangState(stored);
    }
  }, []);

  const setLang = (newLang: UiLanguage) => {
    setLangState(newLang);
    localStorage.setItem("kuknis_ui_lang", newLang);
    document.documentElement.lang = newLang === "amh" ? "am" : "en";
  };

  return (
    <UiLanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </UiLanguageContext.Provider>
  );
}

export function useUiLanguage() {
  const ctx = useContext(UiLanguageContext);
  if (!ctx) throw new Error("useUiLanguage must be used within UiLanguageProvider");
  return ctx;
}
