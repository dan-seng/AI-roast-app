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
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="display-font mb-3 text-xl font-semibold text-white md:text-2xl">
              The Verdict
            </h3>
            <p className="text-sm leading-relaxed text-slate-200 md:text-base">
              {isStreaming && !roast ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                roast || "Your roast will appear here"
              )}
            </p>
            {isStreaming && (
              <span className="mt-1 inline-block animate-bounce text-emerald-300">|</span>
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
