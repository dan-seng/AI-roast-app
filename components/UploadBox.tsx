"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface UploadBoxProps {
  onImageSelect: (image: string) => void;
  previewImage: string | null;
}

export default function UploadBox({ onImageSelect, previewImage }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * (MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.6);
          onImageSelect(compressedDataUrl);
        } else {
          // Fallback if canvas fails
          onImageSelect(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative h-64 w-full cursor-pointer overflow-hidden rounded-2xl border border-dashed transition-all duration-200 ${
        isDragging
          ? "border-emerald-300 bg-emerald-400/10"
          : "border-slate-400/60 bg-slate-900/45 hover:border-emerald-300/70 hover:bg-slate-900/70"
      } ${previewImage ? "p-2" : "p-5"}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewImage ? (
        <div className="relative h-full w-full">
          <Image
            src={previewImage}
            alt="Preview"
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 420px"
            className="rounded-xl object-contain"
          />
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-3 rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-100">Drop image or click to browse</p>
          <p className="mt-1 text-xs text-slate-400">JPG, PNG, GIF</p>
        </div>
      )}
    </div>
  );
}
