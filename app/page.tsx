"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import UploadBox from "@/components/UploadBox";
import RoastCard from "@/components/RoastCard";
import IntensitySlider from "@/components/IntensitySlider";
import DefenseInput from "@/components/DefenseInput";
import ShareButton from "@/components/ShareButton";
import LanguageSelector from "@/components/LanguageSelector";
import AppNavbar from "@/components/AppNavbar";
import { useUiLanguage } from "@/components/UiLanguageProvider";
import { translate } from "@/lib/translations";
import { IntensityLevel } from "@/lib/prompts";
import { RoastLanguage } from "@/lib/languages";

type AuthIntent = "login" | "create" | null;

export default function Home() {
  const { data: session, status } = useSession();
  const { lang } = useUiLanguage();
  const [authIntent, setAuthIntent] = useState<AuthIntent>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<IntensityLevel>("medium");
  const [language, setLanguage] = useState<RoastLanguage>("english");
  const [defense, setDefense] = useState("");
  const [roast, setRoast] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [latestRoastId, setLatestRoastId] = useState<string | null>(null);
  const [pointerGlow, setPointerGlow] = useState({ x: 50, y: 50 });
  const [profileAvatar, setProfileAvatar] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("kuknis_profile_cache");
      if (cached) return JSON.parse(cached).avatar || "";
    }
    return "";
  });
  const [profileName, setProfileName] = useState(() => {
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
      setProfileAvatar(p?.avatar || "");
      setProfileName(p?.name || "");
      if (p) {
        sessionStorage.setItem("kuknis_profile_cache", JSON.stringify({ avatar: p.avatar || "", name: p.name || "" }));
      }
    };
    if (session) {
      void loadProfile();
    }
  }, [session]);

  // Load saved state on mount
  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem("kuknis_roast_state");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.image) setImage(parsed.image);
        if (parsed.intensity) setIntensity(parsed.intensity);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.defense !== undefined) setDefense(parsed.defense);
        if (parsed.roast !== undefined) setRoast(parsed.roast);
        if (parsed.latestRoastId !== undefined) setLatestRoastId(parsed.latestRoastId);
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    const stateToSave = {
      image,
      intensity,
      language,
      defense,
      roast,
      latestRoastId
    };
    try {
      sessionStorage.setItem("kuknis_roast_state", JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Could not save state to sessionStorage (quota exceeded?)", e);
    }
  }, [image, intensity, language, defense, roast, latestRoastId]);

  const handleRoast = async () => {
    if (!image) return;

    setIsStreaming(true);
    setRoast("");

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          intensity,
          language,
          userDefense: defense,
        }),
      });

      const data = await response.json();
      if (data.error) setRoast("Error: " + data.error);
      else {
        setRoast(data.roast);
        setLatestRoastId(data.roastId || null);
      }
    } catch {
      setRoast("Failed to generate roast. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setRoast("");
    setDefense("");
    setLatestRoastId(null);
  };

  const handleRoastAgain = () => {
    setRoast("");
    handleRoast();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen p-3 md:p-6 animate-pulse">
        <section className="min-h-[calc(100vh-24px)] w-full rounded-3xl md:min-h-[calc(100vh-48px)] border border-slate-300/10 bg-slate-900/20 flex flex-col">
          <div className="flex-1 grid lg:grid-cols-[1.25fr_0.75fr] gap-6 lg:gap-0">
            <div className="flex flex-col p-6 md:p-12">
              <div className="mt-12 space-y-4">
                <div className="h-8 w-48 rounded-lg bg-slate-800/60"></div>
                <div className="h-20 w-3/4 rounded-xl bg-slate-800/60 mt-6"></div>
                <div className="h-20 w-1/2 rounded-xl bg-slate-800/60 mt-2"></div>
                <div className="h-10 w-2/3 rounded-lg bg-slate-800/60 mt-8"></div>
              </div>
              <div className="mt-auto grid gap-3 md:max-w-2xl md:grid-cols-3">
                <div className="h-16 rounded-xl bg-slate-800/50"></div>
                <div className="h-16 rounded-xl bg-slate-800/50"></div>
                <div className="h-16 rounded-xl bg-slate-800/50"></div>
              </div>
            </div>
            <div className="flex items-center p-5 md:p-8">
              <div className="h-96 w-full rounded-2xl bg-slate-800/40"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen p-3 md:p-6">
        <section
          className="interactive-bg min-h-[calc(100vh-24px)] w-full rounded-3xl md:min-h-[calc(100vh-48px)] flex flex-col"
          style={
            {
              "--mx": `${pointerGlow.x}%`,
              "--my": `${pointerGlow.y}%`,
            } as CSSProperties
          }
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setPointerGlow({ x, y });
          }}
        >
          <div className="flex-1 grid lg:grid-cols-[1.25fr_0.75fr] gap-4 md:gap-6 lg:gap-0">
            <div className="relative flex flex-col justify-between gap-8 p-6 pb-2 text-center md:p-12 md:text-left lg:gap-0">
              <div className="flex flex-col items-center md:items-start">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300/90 md:mb-4 md:text-lg">
                  {translate("hero.welcomeTo", lang)} <span className="mt-1 block text-4xl md:mt-0 md:inline md:text-5xl">ኩክኒስ</span>
                </p>
                <h1 className="display-font mt-2 max-w-3xl text-4xl font-bold leading-[1.15] text-slate-100 md:mt-0 md:text-7xl md:leading-[0.95] whitespace-pre-line">
                  {translate("hero.roastBetter", lang)}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:mt-6 md:text-xl">
                  {translate("hero.description", lang)}
                </p>
              </div>

              <div className="hidden gap-3 text-sm text-slate-300 md:grid md:max-w-2xl md:grid-cols-3">
                <div className="rounded-xl border border-slate-400/25 bg-slate-900/45 p-4">
                  {translate("hero.instantRoast", lang)}
                </div>
                <div className="rounded-xl border border-slate-400/25 bg-slate-900/45 p-4">
                  {translate("hero.signInOptions", lang)}
                </div>
                <div className="rounded-xl border border-slate-400/25 bg-slate-900/45 p-4">
                  {translate("hero.savedHistory", lang)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-5 pb-8 pt-2 md:p-8 md:pt-8">
              <div className="w-full max-w-md rounded-2xl border border-slate-400/30 bg-slate-950/80 p-6 lg:max-w-none md:p-8">
                <h2 className="display-font text-3xl font-semibold text-slate-100">
                  {authIntent === "create" ? translate("hero.createAccount", lang) : translate("hero.signIn", lang)}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {translate("hero.continueWith", lang)}
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => setAuthIntent("create")}
                    className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      authIntent === "create"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900/60 text-slate-100 hover:bg-slate-800"
                    }`}
                  >
                    {translate("hero.createAccount", lang)}
                  </button>
                  <button
                    onClick={() => setAuthIntent("login")}
                    className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      authIntent === "login" || authIntent === null
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-900/60 text-slate-100 hover:bg-slate-800"
                    }`}
                  >
                    {translate("hero.signIn", lang)}
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  <button
                    onClick={() => signIn("google")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.46a5.52 5.52 0 01-2.39 3.62v3h3.87c2.26-2.08 3.55-5.14 3.55-8.65z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.78-2.11-6.72-4.95H1.29v3.11A12 12 0 0012 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.29A7.2 7.2 0 014.9 12c0-.8.14-1.57.38-2.29V6.6H1.29A12 12 0 000 12c0 1.94.47 3.77 1.29 5.4l3.99-3.11z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.77c1.76 0 3.33.61 4.57 1.8l3.42-3.42C17.95 1.17 15.23 0 12 0A12 12 0 001.29 6.6l3.99 3.11c.94-2.84 3.59-4.94 6.72-4.94z"
                      />
                    </svg>
                    {translate("hero.continueGoogle", lang)}
                  </button>
                  <button
                    onClick={() => signIn("github")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 ring-1 ring-slate-600 transition hover:bg-slate-700"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M12 .5a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.2c-3.34.73-4.04-1.41-4.04-1.41-.55-1.38-1.34-1.75-1.34-1.75-1.1-.76.08-.75.08-.75 1.2.08 1.84 1.24 1.84 1.24 1.08 1.85 2.83 1.32 3.52 1 .11-.78.42-1.31.76-1.62-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.53.12-3.19 0 0 1.01-.33 3.3 1.23a11.4 11.4 0 016 0c2.29-1.56 3.29-1.23 3.29-1.23.67 1.66.26 2.89.13 3.19.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.82 1.11.82 2.24v3.32c0 .32.22.7.83.58A12 12 0 0012 .5z" />
                    </svg>
                    {translate("hero.continueGitHub", lang)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 pb-24 md:py-14 md:pb-14">
        <AppNavbar />

        <header className="mb-6 rounded-3xl border border-slate-300/15 bg-slate-950/45 p-6 md:mb-8 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/90">
                {translate("home.styleLab", lang)}
              </p>
              <h1 className="display-font text-4xl font-bold leading-tight text-slate-100 md:text-6xl">
                {translate("home.createRoast", lang)}
              </h1>
              <p className="mt-3 max-w-2xl text-slate-300 md:text-lg">
                {translate("home.uploadTune", lang)}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-500/50 bg-slate-900/55 px-4 py-3 text-right">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-slate-500/60 bg-slate-800">
                {profileAvatar ? (
                  <Image
                    src={profileAvatar}
                    alt="Profile picture"
                    fill
                    unoptimized
                    sizes="44px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-sm font-semibold text-slate-300">
                    {(profileName || session.user?.name || "U")
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {profileName || session.user?.name || translate("auth.signedIn", lang)}
                </p>
                <p className="text-xs text-slate-400">{session.user?.email}</p>
                <button
                  onClick={() => signOut()}
                  className="mt-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  {translate("home.signOut", lang)}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-slate-300/15 bg-slate-950/50 p-5 md:p-6 lg:sticky lg:top-6 lg:h-fit">
            <h2 className="display-font text-2xl font-semibold text-slate-100">
              {translate("home.controls", lang)}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {translate("home.controlsDesc", lang)}
            </p>

            <div className="mt-5 space-y-5">
              <UploadBox onImageSelect={setImage} previewImage={image} />
              <IntensitySlider
                intensity={intensity}
                onIntensityChange={setIntensity}
              />
              <LanguageSelector
                language={language}
                onLanguageChange={setLanguage}
              />
              <DefenseInput defense={defense} onDefenseChange={setDefense} />

              <button
                onClick={handleRoast}
                disabled={!image || isStreaming}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStreaming ? translate("home.roasting", lang) : translate("home.generateRoast", lang)}
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-300/15 bg-slate-950/45 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="display-font text-2xl font-semibold text-slate-100">
                    {translate("home.result", lang)}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {roast
                      ? translate("home.roastReady", lang)
                      : translate("home.roastPending", lang)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRoastAgain}
                    disabled={!image || isStreaming}
                    className="rounded-xl border border-slate-500/60 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {translate("home.roastAgain", lang)}
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-xl border border-slate-500/60 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
                  >
                    {translate("home.reset", lang)}
                  </button>
                </div>
              </div>

              <RoastCard
                roast={roast}
                isStreaming={isStreaming}
                image={image || ""}
              />
            </div>

            <div className="rounded-3xl border border-slate-300/15 bg-slate-950/45 p-5 md:p-6">
              <h3 className="display-font text-xl font-semibold text-slate-100">
                {translate("home.export", lang)}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {translate("home.exportDesc", lang)}
              </p>
              <div className="mt-4">
                <ShareButton
                  roast={roast}
                  image={image || ""}
                  roastHistoryId={latestRoastId}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
