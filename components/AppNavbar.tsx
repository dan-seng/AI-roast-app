"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useUiLanguage } from "@/components/UiLanguageProvider";
import { translate, UI_LANGUAGES } from "@/lib/translations";

export default function AppNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { lang, setLang } = useUiLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [avatar, setAvatar] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("kuknis_profile_cache");
      if (cached) return JSON.parse(cached).avatar || "";
    }
    return "";
  });
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("kuknis_profile_cache");
      if (cached) return JSON.parse(cached).name || "";
    }
    return "";
  });

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      const p = data?.profile as { avatar?: string; name?: string } | undefined;
      setAvatar(p?.avatar || "");
      setName(p?.name || "");
      if (p) {
        sessionStorage.setItem("kuknis_profile_cache", JSON.stringify({ avatar: p.avatar || "", name: p.name || "" }));
      }
    };
    if (session) {
      void loadProfile();
    }
  }, [session]);

  const langOptions = [
    { value: "eng", label: "English", flag: "🇺🇸" },
    { value: "amh", label: "Amharic", flag: "🇪🇹" }
  ] as const;

  const currentLang = langOptions.find(o => o.value === lang) || langOptions[0];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/50 bg-slate-950/95 px-2 py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] backdrop-blur-lg md:static md:mb-6 md:rounded-2xl md:border md:border-slate-300/15 md:bg-slate-950/45 md:p-3 md:pb-3 md:backdrop-blur-none">
      <div className="flex items-center justify-between gap-2 md:gap-4">
        <div className="flex flex-1 items-center justify-around gap-1 md:flex-none md:justify-start md:gap-2">
          <Link
            href="/"
            className={`flex flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 text-center text-[10px] font-semibold transition md:flex-none md:flex-row md:px-4 md:text-sm ${
              pathname === "/"
                ? "bg-emerald-600/20 text-emerald-400 md:bg-emerald-600 md:text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:bg-slate-900/50 md:text-slate-200"
            }`}
          >
            <svg className="mb-1 h-5 w-5 md:mb-0 md:mr-2 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {translate("nav.create", lang)}
          </Link>
          <Link
            href="/roasts"
            className={`flex flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 text-center text-[10px] font-semibold transition md:flex-none md:flex-row md:px-4 md:text-sm ${
              pathname === "/roasts"
                ? "bg-emerald-600/20 text-emerald-400 md:bg-emerald-600 md:text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:bg-slate-900/50 md:text-slate-200"
            }`}
          >
            <svg className="mb-1 h-5 w-5 md:mb-0 md:mr-2 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 7 9a8 8 0 0110.657 10.657z" />
            </svg>
            {translate("nav.myRoasts", lang)}
          </Link>
          <Link
            href="/profile"
            className={`flex flex-1 flex-col items-center justify-center rounded-xl px-1 py-2 text-center text-[10px] font-semibold transition md:flex-none md:flex-row md:px-4 md:text-sm ${
              pathname === "/profile"
                ? "bg-emerald-600/20 text-emerald-400 md:bg-emerald-600 md:text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 md:bg-slate-900/50 md:text-slate-200"
            }`}
          >
            <svg className="mb-1 h-5 w-5 md:mb-0 md:mr-2 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {translate("nav.profile", lang)}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Custom Stylized Select for Language */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-600/50 bg-slate-900/60 px-2 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 md:gap-2 md:px-3"
            >
              <span className="text-sm md:text-base">{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.label}</span>
              <svg className={`h-3 w-3 text-slate-400 transition-transform ${isLangOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                <div className="absolute bottom-full right-0 z-50 mb-2 w-36 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl md:bottom-auto md:top-full md:mt-2">
                  {langOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setLang(opt.value); setIsLangOpen(false); }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs transition ${
                        lang === opt.value
                          ? "bg-emerald-600/20 text-emerald-400"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <span className="text-base">{opt.flag}</span>
                      <span className="font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {session && (
            <div className="hidden items-center gap-2 rounded-xl bg-slate-900/50 px-2 py-1 md:flex">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-500/60 bg-slate-800">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Profile picture"
                    fill
                    unoptimized
                    sizes="32px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-300">
                    {(name || session.user?.name || "U").slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <p className="pr-1 text-xs font-semibold text-slate-200">
                {name || session.user?.name || translate("auth.user", lang)}
              </p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
