"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

type ExportSize = "portrait" | "story";

interface ShareButtonProps {
  roast: string;
  image: string;
}

const exportSizes: Record<ExportSize, { label: string; width: number; height: number }> = {
  portrait: { label: "1080 x 1350", width: 1080, height: 1350 },
  story: { label: "1080 x 1920", width: 1080, height: 1920 },
};

export default function ShareButton({ roast, image }: ShareButtonProps) {
  const [size, setSize] = useState<ExportSize>("portrait");

  const handleShare = async () => {
    if (!roast || !image) {
      alert("Generate a roast with an image before sharing.");
      return;
    }

    try {
      const { width, height } = exportSizes[size];
      const roastLength = roast.trim().length;
      const textSize =
        roastLength > 1000 ? 18 : roastLength > 850 ? 20 : roastLength > 650 ? 22 : 24;

      const exportRoot = document.createElement("div");
      exportRoot.style.position = "fixed";
      exportRoot.style.left = "-9999px";
      exportRoot.style.top = "-9999px";
      exportRoot.style.width = `${width}px`;
      exportRoot.style.height = `${height}px`;
      exportRoot.style.padding = "52px";
      exportRoot.style.boxSizing = "border-box";
      exportRoot.style.display = "flex";
      exportRoot.style.flexDirection = "column";
      exportRoot.style.gap = "24px";
      exportRoot.style.background =
        "radial-gradient(circle at 15% 10%, #1f8f62 0%, #111827 42%, #05070b 100%)";
      exportRoot.style.borderRadius = "34px";
      exportRoot.style.border = "1px solid rgba(255,255,255,0.14)";

      const title = document.createElement("h2");
      title.textContent = "AI Roast Machine";
      title.style.margin = "0";
      title.style.fontSize = "54px";
      title.style.fontWeight = "800";
      title.style.letterSpacing = "-0.03em";
      title.style.lineHeight = "1.05";
      title.style.color = "#f8fafc";
      title.style.fontFamily = "ui-sans-serif, system-ui, -apple-system";

      const subtitle = document.createElement("p");
      subtitle.textContent = "The Verdict";
      subtitle.style.margin = "0";
      subtitle.style.fontSize = "30px";
      subtitle.style.fontWeight = "600";
      subtitle.style.color = "#a7f3d0";
      subtitle.style.fontFamily = "ui-sans-serif, system-ui, -apple-system";

      const imageWrap = document.createElement("div");
      imageWrap.style.height = size === "story" ? "640px" : "480px";
      imageWrap.style.width = "100%";
      imageWrap.style.borderRadius = "22px";
      imageWrap.style.overflow = "hidden";
      imageWrap.style.border = "1px solid rgba(255,255,255,0.2)";
      imageWrap.style.background = "rgba(2, 6, 23, 0.9)";
      imageWrap.style.display = "flex";
      imageWrap.style.alignItems = "center";
      imageWrap.style.justifyContent = "center";

      const preview = document.createElement("img");
      preview.src = image;
      preview.alt = "Roasted image";
      preview.style.width = "100%";
      preview.style.height = "100%";
      preview.style.objectFit = "contain";
      preview.style.display = "block";

      const roastBox = document.createElement("div");
      roastBox.style.flex = "1";
      roastBox.style.padding = "28px";
      roastBox.style.borderRadius = "20px";
      roastBox.style.background = "rgba(2, 6, 23, 0.86)";
      roastBox.style.border = "1px solid rgba(148, 163, 184, 0.26)";

      const roastText = document.createElement("p");
      roastText.textContent = roast;
      roastText.style.margin = "0";
      roastText.style.fontSize = `${textSize}px`;
      roastText.style.lineHeight = "1.5";
      roastText.style.fontWeight = "500";
      roastText.style.color = "#f1f5f9";
      roastText.style.fontFamily = "ui-sans-serif, system-ui, -apple-system";
      roastText.style.whiteSpace = "pre-wrap";
      roastText.style.wordBreak = "break-word";

      const footer = document.createElement("p");
      footer.textContent = "kuknis.verce.app";
      footer.style.margin = "0";
      footer.style.fontSize = "24px";
      footer.style.fontWeight = "600";
      footer.style.color = "rgba(255,255,255,0.7)";
      footer.style.fontFamily = "ui-sans-serif, system-ui, -apple-system";
      footer.style.letterSpacing = "0.08em";
      footer.style.textTransform = "uppercase";

      imageWrap.appendChild(preview);
      roastBox.appendChild(roastText);
      exportRoot.appendChild(title);
      exportRoot.appendChild(subtitle);
      exportRoot.appendChild(imageWrap);
      exportRoot.appendChild(roastBox);
      exportRoot.appendChild(footer);

      document.body.appendChild(exportRoot);
      await new Promise((resolve) => setTimeout(resolve, 120));

      const canvas = await html2canvas(exportRoot, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      document.body.removeChild(exportRoot);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.download = `roast-card-${width}x${height}.jpg`;
      link.href = dataUrl;
      link.click();

      canvas.toBlob(
        async (blob) => {
          if (!blob) return;
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/jpeg": blob }),
            ]);
            alert("Share image downloaded and copied to clipboard.");
          } catch (err) {
            console.error("Failed to copy image to clipboard:", err);
          }
        },
        "image/jpeg",
        0.9,
      );
    } catch (error) {
      console.error("Error generating share image:", error);
      alert("Failed to generate share image. Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={size}
        onChange={(e) => setSize(e.target.value as ExportSize)}
        className="rounded-xl border border-slate-500/70 bg-slate-900/70 px-3 py-3 text-xs font-semibold text-slate-100 outline-none transition focus:border-emerald-400"
      >
        <option value="portrait">{exportSizes.portrait.label}</option>
        <option value="story">{exportSizes.story.label}</option>
      </select>
      <button
        onClick={handleShare}
        disabled={!roast}
        className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
          roast
            ? "bg-emerald-600 text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] hover:bg-emerald-500"
            : "cursor-not-allowed bg-slate-700 text-slate-400"
        }`}
      >
        Export Image
      </button>
    </div>
  );
}
