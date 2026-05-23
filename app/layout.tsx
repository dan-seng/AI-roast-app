import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kuknis | AI Roast Machine",
  description: "Upload your photo and get a sharp AI roast with style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950">
        <AuthProvider>
          <div className="flex-1">{children}</div>
          
          <footer className="mt-auto border-t border-slate-800/60 bg-slate-950/80 py-8 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="display-font text-lg font-bold text-slate-200">Kuknis</span>
                <span className="text-xs text-slate-500">by Daniel Gidey © {new Date().getFullYear()}</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm font-medium">
                <a href="https://daniel-gidey.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors" title="Portfolio">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><path d="M2 12h20"/></svg>
                  <span>Portfolio</span>
                </a>
                <a href="https://github.com/dan-seng" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-slate-200 transition-colors" title="GitHub">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path></svg>
                  <span className="hidden sm:inline">GitHub</span>
                </a>
                <a href="https://linkedin.com/in/danielgidey" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-slate-200 transition-colors" title="LinkedIn">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
                <a href="https://t.me/living_guy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-slate-200 transition-colors" title="Telegram">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  <span className="hidden sm:inline">Telegram</span>
                </a>
                <a href="https://instagram.com/_dan_el" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-slate-200 transition-colors" title="Instagram">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span className="hidden sm:inline">Instagram</span>
                </a>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
