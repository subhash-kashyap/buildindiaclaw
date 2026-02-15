"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";

export default function SettingsSheet({ onClose }: { onClose: () => void }) {
  const agents = useAppStore((state) => state.agents);
  const demoMode = useAppStore((state) => state.demoMode);
  const setDemoMode = useAppStore((state) => state.setDemoMode);
  const toggleAgentStatus = useAppStore((state) => state.toggleAgentStatus);
  const restartAgent = useAppStore((state) => state.restartAgent);
  const resetDemo = useAppStore((state) => state.resetDemo);

  const primary = useMemo(() => agents.find((agent) => agent.id === "self-1"), [agents]);
  const primaryStatus = primary?.status ?? "offline";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/30">
      <div className="w-full max-w-md rounded-t-3xl bg-cream-50 p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Settings</div>
            <div className="font-display text-lg font-semibold text-ink-900">Control Center</div>
          </div>
          <button onClick={onClose} className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold">
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="rounded-2xl border border-cream-200 bg-cream-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-ink-900">Demo Mode</div>
                <div className="text-xs text-ink-600">Show seeded conversations + activity</div>
              </div>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`h-7 w-12 rounded-full p-1 transition ${demoMode ? "bg-mint-300" : "bg-cream-200"}`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-cream-50 shadow transition ${
                    demoMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-cream-200 bg-cream-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-ink-900">Panda Power</div>
                <div className="text-xs text-ink-600">Turn Panda on or off</div>
              </div>
              <button
                onClick={() =>
                  toggleAgentStatus("self-1", primaryStatus === "online" ? "offline" : "online")
                }
                className={`h-7 w-12 rounded-full p-1 transition ${
                  primaryStatus === "online" ? "bg-mint-300" : "bg-cream-200"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-cream-50 shadow transition ${
                    primaryStatus === "online" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <button
              onClick={() => restartAgent("self-1")}
              className="w-full rounded-2xl bg-ink-900 px-4 py-3 text-sm font-semibold text-cream-50"
            >
              Restart Panda
            </button>
            <button
              onClick={() => resetDemo()}
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm font-semibold text-ink-700"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
