"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import AppNavbar from "@/components/AppNavbar";

type ExportItem = {
  _id: string;
  sizePreset: "1080x1350" | "1080x1920" | "custom";
  createdAt: string;
  fileMeta?: { fileName?: string; bytes?: number };
};

export default function ExportsPage() {
  const { data: session, status } = useSession();
  const [exportsList, setExportsList] = useState<ExportItem[]>([]);
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

  const loadExports = async (nextPage = 1, append = false) => {
    const res = await fetch(`/api/exports?page=${nextPage}&limit=12`);
    const data = await res.json();
    const items = (data?.exports || []) as ExportItem[];
    setExportsList((prev) => (append ? [...prev, ...items] : items));
    setPage(nextPage);
    setHasMore(Boolean(data?.hasMore));
  };

  useEffect(() => {
    if (status === "authenticated") {
      const timer = window.setTimeout(() => {
        void loadExports(1, false);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [status]);

  if (status === "loading") return <div className="min-h-screen grid place-items-center text-slate-200">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="rounded-2xl border border-slate-400/30 bg-slate-950/70 p-6 text-center">
          <p className="text-slate-200">Please sign in to view your exports.</p>
          <button onClick={() => signIn()} className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-white">Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <AppNavbar />
        <section className="rounded-3xl border border-slate-300/15 bg-slate-950/45 p-5 md:p-6">
          <h1 className="display-font text-3xl font-semibold text-slate-100">Exports</h1>
          <p className="mt-1 text-sm text-slate-400">All generated export records.</p>

          <div className="mt-5 space-y-2">
            {exportsList.length === 0 && <p className="text-sm text-slate-500">No exports yet.</p>}
            {exportsList.map((item) => (
              <article key={item._id} className="rounded-xl border border-slate-600/50 bg-slate-900/50 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-100">{item.sizePreset}</p>
                  <p className="text-xs text-slate-400">{formatter.format(new Date(item.createdAt))}</p>
                </div>
                {item.fileMeta?.fileName && <p className="mt-1 text-xs text-slate-400">{item.fileMeta.fileName}</p>}
              </article>
            ))}
            {hasMore && (
              <button onClick={() => loadExports(page + 1, true)} className="rounded-xl border border-slate-500/60 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800">
                Load More
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
