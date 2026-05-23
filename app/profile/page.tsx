"use client";

import { useEffect, useState, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import AppNavbar from "@/components/AppNavbar";
import { IntensityLevel, INTENSITY_LABELS } from "@/lib/prompts";
import { RoastLanguage, ROAST_LANGUAGE_LABELS } from "@/lib/languages";

type ApiProfile = {
  name?: string;
  bio: string;
  avatar: string;
  plan: "free" | "pro" | "team";
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuccessToast = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data?.profile) {
        const p = data.profile as ApiProfile;
        setProfile(p);
        setName(p.name || "");
        setBio(p.bio || "");
        setAvatar(p.avatar || "");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          bio, 
          avatar
        }),
      });
      await loadProfile();
      showSuccessToast();
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

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
      
      // Automatically save profile so the avatar persists globally right away
      await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: data.url }),
      });
      showSuccessToast();
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const confirmDelete = async () => {
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
    return (
      <div className="min-h-screen px-4 py-10 md:py-14 animate-pulse">
        <div className="mx-auto max-w-4xl">
          <div className="h-16 w-full rounded-2xl bg-slate-900/30 mb-8 border border-slate-300/5"></div>
          <div className="h-64 w-full rounded-3xl bg-slate-900/20 mb-8"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="rounded-2xl border border-slate-400/30 bg-slate-950/70 p-8 text-center max-w-sm w-full shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-300">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Profile Access</h2>
          <p className="text-sm text-slate-400 mb-6">Please sign in to view and manage your profile settings.</p>
          <button
            onClick={() => signIn()}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
          >
            Sign in securely
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 md:py-14 pb-32">
      <div className="mx-auto max-w-7xl">
        <AppNavbar />
      </div>

      <div className="mx-auto max-w-5xl mt-6">
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          {/* Main Settings Area */}
          <div className="space-y-6">
            
            {/* Header & Avatar */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-300/15 bg-slate-950/50 p-6 md:p-8 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500/20 to-sky-500/10 opacity-50 blur-2xl"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative group">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-slate-900 bg-slate-800 shadow-xl">
                    {avatar ? (
                      <Image src={avatar} alt="Avatar" fill unoptimized sizes="128px" className="object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-4xl font-bold text-slate-400">
                        {(name || session.user?.name || "U").slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    {/* Hover Overlay for Upload */}
                    <div 
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <span className="text-xs font-semibold text-white">{isUploadingAvatar ? "Uploading..." : "Change"}</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) uploadAvatar(e.target.files[0]);
                    }}
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left mt-2 md:mt-4">
                  <h1 className="display-font text-3xl font-bold text-slate-100">
                    {name || session.user?.name || "Anonymous User"}
                  </h1>
                  <p className="text-emerald-400 font-medium text-sm mt-1">
                    {profile?.plan ? profile.plan.toUpperCase() + " PLAN" : "FREE PLAN"}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">{session.user?.email}</p>
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section className="rounded-3xl border border-slate-300/15 bg-slate-950/45 p-6 md:p-8 shadow-xl">
              <h2 className="display-font text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8z" /></svg>
                Personal Info
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Display Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-slate-600/50 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500/50 focus:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself"
                    rows={3}
                    className="w-full rounded-xl border border-slate-600/50 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500/50 focus:bg-slate-900 resize-none"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Sticky Actions */}
          <div className="space-y-6 mt-6 md:mt-0">
            <div className="sticky top-6 rounded-3xl border border-slate-300/15 bg-slate-950/45 p-6 shadow-xl">
              <h3 className="font-bold text-slate-100 mb-2">Save Changes</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Make sure to save your preferences so they apply to all your future roasts.
              </p>
              <button
                onClick={saveProfile}
                disabled={isSaving}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Update Profile"}
              </button>
            </div>

            <div className="rounded-3xl border border-rose-500/20 bg-rose-950/10 p-6 shadow-xl">
              <h3 className="font-bold text-rose-300 mb-2">Danger Zone</h3>
              <p className="text-xs text-rose-200/60 mb-6 leading-relaxed">
                Permanently delete your account, history, and all generated assets.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="w-full rounded-xl bg-rose-950/50 border border-rose-500/30 px-4 py-2.5 text-sm font-bold text-rose-400 hover:bg-rose-900/50 hover:text-rose-300 transition-all disabled:opacity-50"
              >
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Success Toast */}
      <div 
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/30 px-5 py-4 shadow-2xl transition-all duration-300 transform ${
          showSuccess ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <p className="text-sm font-bold text-emerald-100">Profile updated successfully!</p>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => !isDeleting && setShowDeleteConfirm(false)}
        >
          <div 
            className="relative w-full max-w-sm rounded-3xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Are you absolutely sure?</h3>
            <p className="text-sm text-rose-200/80 mb-6 leading-relaxed">
              This action cannot be undone. All your roasts, images, and personal data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-slate-800/80 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white hover:bg-rose-500 transition disabled:opacity-50 shadow-lg shadow-rose-900/20"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete It"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
