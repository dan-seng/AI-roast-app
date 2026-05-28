"use client";

import { useState } from "react";
import html2canvas from "html2canvas";

type ExportSize = "portrait" | "story";

interface ShareButtonProps {
  roast: string;
  image: string;
  roastHistoryId?: string | null;
  onExportLogged?: () => void;
}

const exportSizes: Record<ExportSize, { label: string; width: number; height: number; preset: "1080x1350" | "1080x1920" }> = {
  portrait: { label: "1080 x 1350", width: 1080, height: 1350, preset: "1080x1350" },
  story: { label: "1080 x 1920", width: 1080, height: 1920, preset: "1080x1920" },
};

export default function ShareButton({ roast, image, roastHistoryId, onExportLogged }: ShareButtonProps) {
  const [size, setSize] = useState<ExportSize>("portrait");
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const generateShareImage = async () => {
    if (!roast || !image) throw new Error("No roast or image");
    
    const { width, height, preset } = exportSizes[size];
    const roastLength = roast.trim().length;
    const textSize = roastLength > 1000 ? 26 : roastLength > 850 ? 30 : roastLength > 650 ? 36 : 44;

    const exportRoot = document.createElement("div");
    exportRoot.style.position = "fixed";
    exportRoot.style.left = "-9999px";
    exportRoot.style.top = "-9999px";
    exportRoot.style.width = `${width}px`;
    exportRoot.style.height = `${height}px`;
    exportRoot.style.boxSizing = "border-box";

    exportRoot.innerHTML = `
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #020617; z-index: 0; overflow: hidden; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;">
        <!-- Glowing background orbs -->
        <div style="position: absolute; top: -20%; left: -20%; width: 100%; height: 100%; background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 65%); z-index: 1;"></div>
        <div style="position: absolute; bottom: -20%; right: -20%; width: 100%; height: 100%; background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 65%); z-index: 1;"></div>
        
        <!-- Main Content Container -->
        <div style="position: relative; z-index: 10; display: flex; flex-direction: column; height: 100%; padding: 64px 72px;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; flex-shrink: 0;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);">
                ኩ
              </div>
              <span style="color: white; font-size: 38px; font-weight: 800; letter-spacing: 0.15em;">KUKNIS</span>
            </div>
            <div style="padding: 14px 28px; border-radius: 100px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #6ee7b7; font-size: 22px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em;">
              AI Verdict
            </div>
          </div>

          <!-- Image Container -->
          <div style="position: relative; width: 100%; height: ${size === 'story' ? '50%' : '42%'}; border-radius: 36px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6); background: #0f172a; flex-shrink: 0; display: flex; justify-content: center; align-items: center;">
             <div id="roast-bg-img" style="position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; background-size: cover; background-position: center; filter: blur(30px) brightness(0.5); z-index: 1;"></div>
             <img id="roast-fg-img" style="position: relative; max-width: 100%; max-height: 100%; width: auto; height: auto; z-index: 2; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);" />
             <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%); z-index: 3; pointer-events: none;"></div>
          </div>

          <!-- Roast Text Container -->
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; position: relative; padding: 40px 0; margin-top: 10px;">
            <div style="position: absolute; top: -10px; left: -10px; font-size: 200px; color: rgba(255,255,255,0.08); font-family: Georgia, serif; line-height: 1; z-index: 1;">"</div>
            <p id="roast-text-node" style="position: relative; z-index: 2; margin: 0; font-size: ${textSize}px; line-height: 1.5; font-weight: 600; color: #e2e8f0; text-align: center; white-space: pre-wrap; word-break: break-word;"></p>
            <div style="position: absolute; bottom: -60px; right: -10px; font-size: 200px; color: rgba(255,255,255,0.08); font-family: Georgia, serif; line-height: 1; z-index: 1; transform: rotate(180deg);">"</div>
          </div>

          <!-- Footer -->
          <div style="margin-top: auto; padding-top: 40px; display: flex; justify-content: center; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;">
            <p style="margin: 0; font-size: 24px; font-weight: 500; color: #94a3b8; letter-spacing: 0.05em;">
              Get your own roast at <span style="color: #34d399; font-weight: 700;">kuknis.vercel.app</span>
            </p>
          </div>

        </div>
      </div>
    `;

    (exportRoot.querySelector("#roast-bg-img") as HTMLElement).style.backgroundImage = `url(${image})`;
    (exportRoot.querySelector("#roast-fg-img") as HTMLImageElement).src = image;
    (exportRoot.querySelector("#roast-text-node") as HTMLElement).textContent = roast;

    document.body.appendChild(exportRoot);
    await new Promise((resolve) => setTimeout(resolve, 120));

    const canvas = await html2canvas(exportRoot, {
      backgroundColor: null,
      scale: 1, // Reduced from 2 to generate much faster and keep file sizes small
      useCORS: true,
      logging: false,
    });

    document.body.removeChild(exportRoot);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9),
    );

    return { canvas, blob, width, height, preset };
  };

  const handleShare = async () => {
    if (!roast || !image) {
      showToast("Generate a roast with an image before sharing.");
      return;
    }

    setIsGenerating(true);

    try {
      const { canvas, blob, width, height, preset } = await generateShareImage();

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const fileName = `roast-card-${width}x${height}.jpg`;
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      if (blob) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/jpeg": blob })]);
        } catch (err) {
          console.error("Failed to copy image to clipboard:", err);
        }

        await fetch("/api/exports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roastHistoryId: roastHistoryId || undefined,
            sizePreset: preset,
            fileMeta: {
              fileName,
              mimeType: "image/jpeg",
              bytes: blob.size,
            },
          }),
        });

        if (onExportLogged) {
          onExportLogged();
        }
      }

      showToast("Share image downloaded and copied to clipboard.");
    } catch (error) {
      console.error("Error generating share image:", error);
      showToast("Failed to generate share image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativeShare = async (platform: string) => {
    if (!roast || !image) return;
    setIsGenerating(true);
    try {
      const { blob } = await generateShareImage();
      if (!blob) throw new Error("Failed to generate image");

      const file = new File([blob], "roast.jpg", { type: "image/jpeg" });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `My AI Roast - ${platform}`,
          text: roast,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `My AI Roast - ${platform}`,
          text: roast,
          url: window.location.href,
        });
      } else {
        showToast("Sharing directly to this app is only supported on mobile devices.");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSocialPlatformShare = async (platform: string, getUrl: () => string) => {
    if (!roast || !image) return;
    setIsGenerating(true);
    
    // Open a blank window immediately to prevent popup blockers
    // We'll set its location after generating the image
    const popup = window.open("", "_blank");
    
    try {
      const { blob } = await generateShareImage();
      
      if (blob) {
        try {
          // Attempt to re-focus the document before writing to clipboard
          if (typeof window !== "undefined") window.focus();
          await navigator.clipboard.write([new ClipboardItem({ "image/jpeg": blob })]);
        } catch (err) {
          console.error("Failed to copy image to clipboard:", err);
        }
      }
      
      if (popup) {
        popup.location.href = getUrl();
        showToast(`Image ready! Paste it into your ${platform} post.`);
      } else {
        window.open(getUrl(), "_blank");
      }
    } catch (error) {
      console.error("Error generating share image:", error);
      if (popup) popup.close();
      window.open(getUrl(), "_blank"); // Fallback without image
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="flex flex-wrap items-center gap-2">
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
        disabled={!roast || isGenerating}
        className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
          roast
            ? "bg-emerald-600 text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] hover:bg-emerald-500"
            : "cursor-not-allowed bg-slate-700 text-slate-400"
        } ${isGenerating ? "opacity-75 cursor-wait" : ""}`}
      >
        {isGenerating ? "Processing..." : "Export Image"}
      </button>
     
   

      {/* Sleek UI Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl bg-slate-900 border border-emerald-500/30 px-5 py-4 shadow-2xl animate-in slide-in-from-bottom-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <p className="text-sm font-bold text-slate-200">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
