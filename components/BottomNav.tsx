"use client";

import Link from "next/link";
import { trackClick } from "@/lib/analytics";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Friends", href: "/friends" },
  { label: "Observatory", href: "/observatory" }
];

export default function BottomNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="fixed bottom-16 left-1/2 z-40 w-[92%] max-w-md -translate-x-1/2 rounded-3xl bg-cream-50/90 px-4 py-3 shadow-card backdrop-blur border border-cream-200/50">
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const active = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => trackClick('Navigation', { target: item.label })}
              className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                active ? "bg-mint-100 text-ink-900" : "text-ink-700 hover:bg-cream-200"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-mint-500" : "bg-cream-300"}`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
