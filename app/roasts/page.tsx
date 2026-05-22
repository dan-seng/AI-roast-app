"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import AppNavbar from "@/components/AppNavbar";
import { IntensityLevel, INTENSITY_LABELS } from "@/lib/prompts";
import { RoastLanguage, ROAST_LANGUAGE_LABELS } from "@/lib/languages";

type RoastItem = {
  _id: string;
  roastText: string;
  intensity: IntensityLevel;
  language: RoastLanguage;
  createdAt: string;
};

export default function RoastsPage() {
  const { data: session, status } = useSession();
  const [roasts, setRoasts] = useState<RoastItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  const loadRoasts = async (nextPage = 1, append = false) => {
    const res = await fetch(`/api/roasts?page=${nextPage}&limit=12`);
    const data = await res.json();
    const items = (data?.roasts || []) as RoastItem[];
    setRoasts((prev) => (append ? [...prev, ...items] : items));
    setPage(nextPage);
    setHasMore(Boolean(data?.hasMore));
  };

  const deleteRoast = async (id: string) => {
    await fetch(`/api/roasts/${id}`, { method: "DELETE" });
    await loadRoasts(1, false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      const timer = window.setTimeout(() => {
        void loadRoasts(1, false);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [status]);

  if (status === "loading") {
    return <div className="min-h-screen grid place-items-center text-slate-200">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="rounded-2xl border border-slate-400/30 bg-slate-950/70 p-6 text-center">
          <p className="text-slate-200">Please sign in to view your roasts.</p>
          <button onClick={() => signIn()} className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-white">
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <AppNavbar />
        <section className="rounded-3xl border border-slate-300/15 bg-slate-950/45 p-5 md:p-6">
          <h1 className="display-font text-3xl font-semibold text-slate-100">My Roasts</h1>
          <p className="mt-1 text-sm text-slate-400">Saved roast history from your account.</p>

          <div className="mt-5 space-y-3">
            {roasts.length === 0 && <p className="text-sm text-slate-500">No roasts yet.</p>}
            {roasts.map((item) => (
              <article key={item._id} className="rounded-xl border border-slate-600/50 bg-slate-900/50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    {INTENSITY_LABELS[item.intensity]} • {ROAST_LANGUAGE_LABELS[item.language]} • {formatter.format(new Date(item.createdAt))}
                  </p>
                  <button onClick={() => deleteRoast(item._id)} className="text-xs font-semibold text-rose-300 hover:text-rose-200">
                    Delete
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-200">{item.roastText}</p>
              </article>
            ))}
            {hasMore && (
              <button
                onClick={() => loadRoasts(page + 1, true)}
                className="rounded-xl border border-slate-500/60 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800"
              >
                Load More
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
