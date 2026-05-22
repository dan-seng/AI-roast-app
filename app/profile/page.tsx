"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import AppNavbar from "@/components/AppNavbar";
import { IntensityLevel } from "@/lib/prompts";
import { RoastLanguage } from "@/lib/languages";

type ApiProfile = {
  name?: string;
  bio: string;
  avatar: string;
  plan: "free" | "pro" | "team";
  preferences: {
    defaultIntensity: IntensityLevel;
    defaultLanguage: RoastLanguage;
    theme: "dark" | "light" | "system";
  };
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProfile = async () => {
    const res = await fetch("/api/me");
    const data = await res.json();
    if (data?.profile) {
      const p = data.profile as ApiProfile;
      setProfile(p);
      setName(p.name || "");
      setAvatar(p.avatar || "");
    }
  };

  const saveProfile = async () => {
    await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, avatar }),
    });
    await loadProfile();
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", avatarFile);

      const res = await fetch("/api/uploads/avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Failed to upload image");
        return;
      }
      setAvatar(data.url);
      setAvatarFile(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account and all data permanently? This cannot be undone.",
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await fetch("/api/me", { method: "DELETE" });
      await signOut({ callbackUrl: "/" });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      const timer = window.setTimeout(() => {
        void loadProfile();
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
          <p className="text-slate-200">Please sign in to view your profile.</p>
          <button
            onClick={() => signIn()}
            className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-white"
          >
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
          <h1 className="display-font text-3xl font-semibold text-slate-100">Profile</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your public profile details.</p>

          <div className="mt-5 grid gap-4 md:max-w-2xl">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Name (optional)</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className="w-full rounded-xl border border-slate-500/70 bg-slate-950/65 px-3 py-2 text-sm text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Profile Picture</label>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-100 hover:file:bg-slate-700"
                />
                <button
                  type="button"
                  onClick={uploadAvatar}
                  disabled={!avatarFile || isUploadingAvatar}
                  className="rounded-xl border border-slate-500/60 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {isUploadingAvatar ? "Uploading..." : "Upload"}
                </button>
              </div>
              <input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="/uploads/your-image.jpg"
                className="w-full rounded-xl border border-slate-500/70 bg-slate-950/65 px-3 py-2 text-sm text-slate-100 outline-none"
              />
              {avatar && (
                <div className="relative mt-2 h-20 w-20 overflow-hidden rounded-xl border border-slate-500/60">
                  <Image
                    src={avatar}
                    alt="Profile preview"
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <button
              onClick={saveProfile}
              className="w-fit rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Save Profile
            </button>
          </div>

          {profile && (
            <p className="mt-4 text-xs text-slate-400">
              Current plan: {profile.plan} • Theme: {profile.preferences.theme}
            </p>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-rose-400/30 bg-rose-950/20 p-5 md:p-6">
          <h2 className="display-font text-2xl font-semibold text-rose-200">Danger Zone</h2>
          <p className="mt-1 text-sm text-rose-200/80">
            Delete your account and remove profile, roasts, exports, and login data.
          </p>
          <button
            onClick={deleteAccount}
            disabled={isDeleting}
            className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </section>
      </div>
    </div>
  );
}
