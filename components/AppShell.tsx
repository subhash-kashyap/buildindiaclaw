"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";
import { useAppStore } from "@/lib/store";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const setOnboarded = useAppStore((state) => state.setOnboarded);
  const seedDemo = useAppStore((state) => state.seedDemo);
  const setDemoMode = useAppStore((state) => state.setDemoMode);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("openclaw:onboarded");
    const demoStored = localStorage.getItem("openclaw:demo");
    if (stored === "1") {
      setOnboarded(true);
      seedDemo();
    }
    if (demoStored === "0") {
      setDemoMode(false);
    }
  }, [setOnboarded, seedDemo, setDemoMode]);

  const hideNav = pathname.startsWith("/chat");

  return (
    <div className={`min-h-screen ${hideNav ? "pb-8" : "pb-24"}`}>
      {children}
      {hideNav ? null : <BottomNav currentPath={pathname} />}
    </div>
  );
}
