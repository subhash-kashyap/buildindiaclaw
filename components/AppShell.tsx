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
  const restoreRealState = useAppStore((state) => state.restoreRealState);
  const refreshRealPairing = useAppStore((state) => state.refreshRealPairing);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("openclaw:onboarded");
    const demoStored = localStorage.getItem("openclaw:demo");
    const realModeStored = localStorage.getItem("openclaw:realMode");
    const realPairingId = localStorage.getItem("openclaw:realPairingId") ?? undefined;
    if (stored === "1") {
      setOnboarded(true);
      seedDemo();
    }
    if (demoStored === "0") {
      setDemoMode(false);
    }
    if (realModeStored === "1") {
      restoreRealState({ enabled: true, pairingId: realPairingId });
      if (realPairingId) {
        void refreshRealPairing();
      }
    }
  }, [setOnboarded, seedDemo, setDemoMode, restoreRealState, refreshRealPairing]);

  const hideNav = pathname.startsWith("/chat");

  return (
    <div className={`min-h-screen ${hideNav ? "pb-8" : "pb-24"}`}>
      {children}
      {hideNav ? null : <BottomNav currentPath={pathname} />}
    </div>
  );
}
