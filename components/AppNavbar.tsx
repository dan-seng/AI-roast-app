"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const links = [
  { href: "/", label: "Create" },
  { href: "/roasts", label: "My Roasts" },
  { href: "/profile", label: "Profile" },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [avatar, setAvatar] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("kuknis_profile_cache");
      if (cached) return JSON.parse(cached).avatar || "";
    }
    return "";
  });
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("kuknis_profile_cache");
      if (cached) return JSON.parse(cached).name || "";
    }
    return "";
  });

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      const p = data?.profile as { avatar?: string; name?: string } | undefined;
      setAvatar(p?.avatar || "");
      setName(p?.name || "");
      if (p) {
        sessionStorage.setItem("kuknis_profile_cache", JSON.stringify({ avatar: p.avatar || "", name: p.name || "" }));
      }
    };
    if (session) {
      void loadProfile();
    }
  }, [session]);

  return (
    <nav className="mb-6 rounded-2xl border border-slate-300/15 bg-slate-950/45 p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900/50 text-slate-200 hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {session && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-900/50 px-2 py-1">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-500/60 bg-slate-800">
              {avatar ? (
                <Image
                  src={avatar}
                  alt="Profile picture"
                  fill
                  unoptimized
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-xs font-semibold text-slate-300">
                  {(name || session.user?.name || "U").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <p className="pr-1 text-xs font-semibold text-slate-200">
              {name || session.user?.name || "User"}
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}
