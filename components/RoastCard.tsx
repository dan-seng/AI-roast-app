"use client";

import Image from "next/image";

interface RoastCardProps {
  roast: string;
  isStreaming: boolean;
  image: string;
}

export default function RoastCard({ roast, isStreaming, image }: RoastCardProps) {
  return (
    <div
      id="roast-card"
      className="overflow-hidden rounded-2xl border border-slate-400/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 md:p-6"
    >
      {image ? (
        <div className="grid gap-5 md:grid-cols-[280px_minmax(0,1fr)] md:items-start">
          <div className="relative min-h-[240px] overflow-hidden rounded-xl border border-slate-300/20 bg-slate-950/70">
            <Image
              src={image}
              alt="Roasted image"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 280px"
              className="object-contain"
            />
          </div>

          <div>
            <h3 className="display-font mb-3 text-xl font-semibold text-white md:text-2xl">
              The Verdict
            </h3>
            {isStreaming && !roast ? (
              <div className="mt-2 space-y-3 animate-pulse">
                <div className="h-4 w-full rounded-md bg-slate-700/50"></div>
                <div className="h-4 w-11/12 rounded-md bg-slate-700/50"></div>
                <div className="h-4 w-4/5 rounded-md bg-slate-700/50"></div>
                <div className="h-4 w-5/6 rounded-md bg-slate-700/50"></div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-slate-200 md:text-base">
                {roast || "Your roast will appear here"}
                {isStreaming && roast && (
                  <span className="ml-1 inline-block animate-pulse text-emerald-300">|</span>
                )}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-500/60 bg-slate-900/40 p-8 text-center text-slate-400">
          Upload an image to see your roast card.
        </div>
      )}
    </div>
  );
}
