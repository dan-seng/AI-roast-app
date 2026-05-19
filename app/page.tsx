"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";
import RoastCard from "@/components/RoastCard";
import IntensitySlider from "@/components/IntensitySlider";
import DefenseInput from "@/components/DefenseInput";
import ShareButton from "@/components/ShareButton";
import LanguageSelector from "@/components/LanguageSelector";
import { IntensityLevel } from "@/lib/prompts";
import { RoastLanguage } from "@/lib/languages";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<IntensityLevel>("medium");
  const [language, setLanguage] = useState<RoastLanguage>("english");
  const [defense, setDefense] = useState("");
  const [roast, setRoast] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleRoast = async () => {
    if (!image) return;

    setIsStreaming(true);
    setRoast("");

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, intensity, language, userDefense: defense }),
      });

      const data = await response.json();
      if (data.error) setRoast("Error: " + data.error);
      else setRoast(data.roast);
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
  };

  const handleRoastAgain = () => {
    setRoast("");
    handleRoast();
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <header className="mb-6 rounded-3xl border border-slate-300/15 bg-slate-950/45 p-6 md:mb-8 md:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/90">
            Style-First Roast Lab
          </p>
          <h1 className="display-font text-4xl font-bold leading-tight text-slate-100 md:text-6xl">
            AI Roast Machine
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300 md:text-lg">
            Upload, tune, roast, and export in a cleaner workspace built for speed.
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-slate-300/15 bg-slate-950/50 p-5 md:p-6 lg:sticky lg:top-6 lg:h-fit">
            <h2 className="display-font text-2xl font-semibold text-slate-100">Controls</h2>
            <p className="mt-1 text-sm text-slate-400">Upload and configure your roast.</p>

            <div className="mt-5 space-y-5">
              <UploadBox onImageSelect={setImage} previewImage={image} />

              <IntensitySlider intensity={intensity} onIntensityChange={setIntensity} />
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
              <DefenseInput defense={defense} onDefenseChange={setDefense} />

              <button
                onClick={handleRoast}
                disabled={!image || isStreaming}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStreaming ? "Roasting..." : "Generate Roast"}
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-300/15 bg-slate-950/45 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="display-font text-2xl font-semibold text-slate-100">Result</h2>
                  <p className="text-sm text-slate-400">
                    {roast ? "Your roast is ready." : "Your roast will appear here after generation."}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRoastAgain}
                    disabled={!image || isStreaming}
                    className="rounded-xl border border-slate-500/60 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Roast Again
                  </button>
                  <button
                    onClick={handleReset}
                    className="rounded-xl border border-slate-500/60 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <RoastCard roast={roast} isStreaming={isStreaming} image={image || ""} />
            </div>

            <div className="rounded-3xl border border-slate-300/15 bg-slate-950/45 p-5 md:p-6">
              <h3 className="display-font text-xl font-semibold text-slate-100">Export</h3>
              <p className="mt-1 text-sm text-slate-400">
                Download a social media image or copy it directly to clipboard.
              </p>
              <div className="mt-4">
                <ShareButton roast={roast} image={image || ""} />
              </div>
            </div>
          </section>
        </main>

        <footer className="pb-4 pt-8 text-center text-sm text-slate-500">
          Built with Next.js, Tailwind CSS, and Gemini AI
        </footer>
      </div>
    </div>
  );
}
