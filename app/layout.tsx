import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import AppShell from "@/components/AppShell";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"]
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "OpenClaw msg app",
  description: "Agent control msg app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="bg-cream-100 text-ink-800 font-body">
        <AppShell>{children}</AppShell>
        <footer className="fixed bottom-0 left-0 right-0 z-[100] w-full bg-cream-50/80 px-4 py-2 text-center backdrop-blur-md border-t border-cream-200/50">
          <p className="font-medium text-xs text-ink-700 sm:text-sm">
            I made this, its in the works. Meet me here:{" "}
            <a 
              href="https://x.com/numberkash" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-ink-900 underline decoration-mint-500 decoration-2 underline-offset-4 hover:text-mint-600 transition-colors"
            >
              Twitter link
            </a>
          </p>
        </footer>
      </body>
    </html>
);
}
