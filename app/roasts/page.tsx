"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import AppNavbar from "@/components/AppNavbar";
import { useUiLanguage } from "@/components/UiLanguageProvider";
import { translate } from "@/lib/translations";
import { IntensityLevel } from "@/lib/prompts";
import { RoastLanguage, ROAST_LANGUAGE_LABELS } from "@/lib/languages";
import { type TranslationKey } from "@/lib/translations";

function tlIntensity(level: IntensityLevel): TranslationKey {
  return `intensityLabel.${level}` as TranslationKey;
}

type RoastItem = {
  _id: string;
  roastText: string;
  imageRef?: string;
  intensity: IntensityLevel;
  language: RoastLanguage;
  createdAt: string;
};

export default function RoastsPage() {
  const { data: session, status } = useSession();
  const { lang } = useUiLanguage();
  const [roasts, setRoasts] = useState<RoastItem[]>(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("kuknis_roasts_list");
      if (cached) return JSON.parse(cached).roasts || [];
    }
    return [];
  });
  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("kuknis_roasts_list");
      if (cached) return JSON.parse(cached).page || 1;
    }
    return 1;
  });
  const [hasMore, setHasMore] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("kuknis_roasts_list");
      if (cached) return JSON.parse(cached).hasMore || false;
    }
    return false;
  });
  const [selectedRoast, setSelectedRoast] = useState<RoastItem | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("kuknis_roasts_list");
      if (cached) return false;
    }
    return true;
  });
  const [roastToDelete, setRoastToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (roasts.length > 0) {
      sessionStorage.setItem("kuknis_roasts_list", JSON.stringify({ roasts, page, hasMore }));
    }
  }, [roasts, page, hasMore]);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  const loadRoasts = async (nextPage = 1, append = false) => {
    // Only show loading skeleton if we are NOT appending and have NO cached roasts
    if (!append && roasts.length === 0) setIsLoadingList(true);
    try {
      const res = await fetch(`/api/roasts?page=${nextPage}&limit=12`);
      const data = await res.json();
      const items = (data?.roasts || []) as RoastItem[];
      setRoasts((prev) => (append ? [...prev, ...items] : items));
      setPage(nextPage);
      setHasMore(Boolean(data?.hasMore));
    } catch (err) {
      console.error("Failed to load roasts", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const confirmDelete = async () => {
    if (!roastToDelete) return;
    setIsDeleting(true);
    await fetch(`/api/roasts/${roastToDelete}`, { method: "DELETE" });
    await loadRoasts(1, false);
    setIsDeleting(false);
    setRoastToDelete(null);
    setSelectedRoast(null);
  };

  const openRoastDetail = (item: RoastItem) => {
    setSelectedRoast(item);
  };

  useEffect(() => {
    if (status === "authenticated") {
      // Always fetch fresh data on mount (stale-while-revalidate pattern)
      void loadRoasts(1, false);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen px-4 py-10 md:py-14 animate-pulse">
        <div className="mx-auto max-w-7xl">
          <div className="h-16 w-full rounded-2xl bg-slate-900/30 mb-8 border border-slate-300/5"></div>
          <section className="rounded-3xl border border-slate-300/10 bg-slate-950/20 p-5 md:p-6">
            <div className="h-8 w-48 bg-slate-800/50 rounded-lg mb-2"></div>
            <div className="h-4 w-64 bg-slate-800/40 rounded mt-2 mb-8"></div>
            <div className="mt-5 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 w-full rounded-xl bg-slate-800/30"></div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="rounded-2xl border border-slate-400/30 bg-slate-950/70 p-6 text-center">
          <p className="text-slate-200">{translate("roasts.signInPrompt", lang)}</p>
          <button onClick={() => signIn()} className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-white">
            {translate("auth.signIn", lang)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 pb-24 md:py-14 md:pb-14">
      <div className="mx-auto max-w-7xl">
        <AppNavbar />
        <section className="rounded-3xl border border-slate-300/15 bg-slate-950/45 p-5 md:p-6">
          <h1 className="display-font text-3xl font-semibold text-slate-100">{translate("roasts.title", lang)}</h1>
          <p className="mt-1 text-sm text-slate-400">{translate("roasts.description", lang)}</p>

          <div className="mt-5 space-y-3">
            {isLoadingList ? (
              Array.from({ length: 4 }).map((_, i) => (
                <article key={i} className="rounded-xl border border-slate-600/30 bg-slate-900/30 p-4 animate-pulse shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="h-3 w-48 rounded bg-slate-700/50"></div>
                    <div className="h-4 w-12 rounded bg-slate-700/50"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-slate-700/50"></div>
                    <div className="h-3 w-5/6 rounded bg-slate-700/50"></div>
                  </div>
                </article>
              ))
            ) : roasts.length === 0 ? (
              <p className="text-sm text-slate-500">{translate("roasts.empty", lang)}</p>
            ) : (
              roasts.map((item) => (
                <article 
                  key={item._id} 
                  className="rounded-xl border border-slate-600/50 bg-slate-900/50 p-3 md:p-4 cursor-pointer hover:bg-slate-800/60 transition shadow-sm flex flex-col md:flex-row gap-4 md:items-start"
                  onClick={() => openRoastDetail(item)}
                >
                  <div 
                    id={`thumb-wrapper-${item._id}`}
                    className="relative h-48 w-full md:h-24 md:w-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-800/80 border border-slate-600/50"
                  >
                    <img 
                      src={`/api/roasts/${item._id}/image`} 
                      alt="Roasted image" 
                      className="h-full w-full object-cover" 
                      onError={(e) => {
                        // Hide the wrapper if the image fails to load (e.g. 404 for old roasts without imageRef)
                        const wrapper = document.getElementById(`thumb-wrapper-${item._id}`);
                        if (wrapper) wrapper.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full overflow-hidden">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-xs text-slate-400 font-medium">
                        {translate(tlIntensity(item.intensity), lang)} • {ROAST_LANGUAGE_LABELS[item.language]} • {formatter.format(new Date(item.createdAt))}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setRoastToDelete(item._id); }} 
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors shrink-0 px-2 py-1 rounded hover:bg-rose-500/10"
                      >
                        {translate("roasts.delete", lang)}
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed">{item.roastText}</p>
                  </div>
                </article>
              ))
            )}
            
            {!isLoadingList && hasMore && (
              <button
                onClick={() => loadRoasts(page + 1, true)}
                className="rounded-xl border border-slate-500/60 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800"
              >
                {translate("roasts.loadMore", lang)}
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Detail Modal */}
      {selectedRoast && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSelectedRoast(null)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-600/50 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRoast(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <h2 className="display-font text-2xl font-bold text-slate-100 mb-5 pr-8">
              {translate("roasts.details", lang)}
            </h2>
            
            {selectedRoast.imageRef ? (
              <div className="mb-6 relative w-full rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-950/50">
                <img src={selectedRoast.imageRef} alt="Roasted image" className="w-full max-h-[50vh] object-contain" />
              </div>
            ) : (
              <div className="mb-6 rounded-2xl border border-dashed border-slate-700/50 bg-slate-950/30 p-6 text-center text-sm text-slate-500">
                {translate("roasts.oldImage", lang)}
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-400/10 text-xs font-semibold text-emerald-300 border border-emerald-400/20">
                {translate(tlIntensity(selectedRoast.intensity), lang)} {translate("common.intensity", lang)}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-sky-400/10 text-xs font-semibold text-sky-300 border border-sky-400/20">
                {ROAST_LANGUAGE_LABELS[selectedRoast.language]}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800/50 text-xs font-semibold text-slate-300 border border-slate-700/50">
                {formatter.format(new Date(selectedRoast.createdAt))}
              </span>
            </div>

            <div className="bg-slate-950/60 rounded-2xl p-5 md:p-6 border border-slate-800/60">
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {selectedRoast.roastText}
              </p>
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-800 flex justify-end">
               <button 
                 onClick={() => setRoastToDelete(selectedRoast._id)} 
                 className="px-4 py-2 rounded-xl text-sm font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all"
               >
                 {translate("roasts.deleteRoast", lang)}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {roastToDelete && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => !isDeleting && setRoastToDelete(null)}
        >
          <div 
            className="relative w-full max-w-sm rounded-3xl border border-slate-600/50 bg-slate-900 p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">{translate("roasts.deleteTitle", lang)}</h3>
            <p className="text-sm text-slate-400 mb-6">
              {translate("roasts.deleteWarning", lang)}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setRoastToDelete(null)}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
              >
                {translate("roasts.cancel", lang)}
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 transition disabled:opacity-50"
              >
                {isDeleting ? translate("roasts.deleting", lang) : translate("roasts.delete", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
