"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import AppNavbar from "@/components/AppNavbar";

type ActivityItem = {
  id: string;
  type: "roast" | "export";
  label: string;
  createdAt: string;
};

type RoastApiItem = {
  _id: string;
  createdAt: string;
};

type ExportApiItem = {
  _id: string;
  sizePreset: "1080x1350" | "1080x1920" | "custom";
  createdAt: string;
};

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<ActivityItem[]>([]);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  const loadHistory = async () => {
    const [roastRes, exportRes] = await Promise.all([
      fetch("/api/roasts?page=1&limit=25"),
      fetch("/api/exports?page=1&limit=25"),
    ]);

    const roastData = await roastRes.json();
    const exportData = await exportRes.json();

    const roasts: ActivityItem[] = ((roastData?.roasts || []) as RoastApiItem[]).map((r) => ({
      id: `roast-${r._id}`,
      type: "roast",
      label: "Generated a roast",
      createdAt: r.createdAt,
    }));

    const exportsList: ActivityItem[] = ((exportData?.exports || []) as ExportApiItem[]).map((e) => ({
      id: `export-${e._id}`,
      type: "export",
      label: `Exported ${e.sizePreset}`,
      createdAt: e.createdAt,
    }));

    const merged = [...roasts, ...exportsList].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    setItems(merged);
  };

  useEffect(() => {
    if (status === "authenticated") {
      const timer = window.setTimeout(() => {
        void loadHistory();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [status]);

  if (status === "loading") return <div className="min-h-screen grid place-items-center text-slate-200">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="rounded-2xl border border-slate-400/30 bg-slate-950/70 p-6 text-center">
          <p className="text-slate-200">Please sign in to view history.</p>
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
          <h1 className="display-font text-3xl font-semibold text-slate-100">History</h1>
          <p className="mt-1 text-sm text-slate-400">Recent activity across your account.</p>

          <div className="mt-5 space-y-2">
            {items.length === 0 && <p className="text-sm text-slate-500">No activity yet.</p>}
            {items.map((item) => (
              <article key={item.id} className="flex items-center justify-between rounded-xl border border-slate-600/50 bg-slate-900/50 px-3 py-2">
                <p className="text-sm text-slate-100">{item.label}</p>
                <p className="text-xs text-slate-400">{formatter.format(new Date(item.createdAt))}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
