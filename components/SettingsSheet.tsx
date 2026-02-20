"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";

function statusText(status: "disconnected" | "pairing" | "connected" | "error") {
  if (status === "connected") return "Connected";
  if (status === "pairing") return "Waiting for ClawPC";
  if (status === "error") return "Error";
  return "Disconnected";
}

export default function SettingsSheet({ onClose }: { onClose: () => void }) {
  const agents = useAppStore((state) => state.agents);
  const demoMode = useAppStore((state) => state.demoMode);
  const setDemoMode = useAppStore((state) => state.setDemoMode);
  const toggleAgentStatus = useAppStore((state) => state.toggleAgentStatus);
  const restartAgent = useAppStore((state) => state.restartAgent);
  const resetDemo = useAppStore((state) => state.resetDemo);

  const realModeEnabled = useAppStore((state) => state.realModeEnabled);
  const realConnectionStatus = useAppStore((state) => state.realConnectionStatus);
  const realPairingCode = useAppStore((state) => state.realPairingCode);
  const realSetupCommand = useAppStore((state) => state.realSetupCommand);
  const realPairingExpiresAt = useAppStore((state) => state.realPairingExpiresAt);
  const realError = useAppStore((state) => state.realError);
  const setRealModeEnabled = useAppStore((state) => state.setRealModeEnabled);
  const startRealPairing = useAppStore((state) => state.startRealPairing);
  const refreshRealPairing = useAppStore((state) => state.refreshRealPairing);
  const confirmRealPairing = useAppStore((state) => state.confirmRealPairing);

  const [showExperimentalPopup, setShowExperimentalPopup] = useState(false);
  const [betaInput, setBetaInput] = useState("");
  const [betaError, setBetaError] = useState<string | undefined>();

  const primary = useMemo(() => agents.find((agent) => agent.id === "self-1"), [agents]);
  const primaryStatus = primary?.status ?? "offline";

  const handleToggleRealMode = () => {
    if (realModeEnabled) {
      setRealModeEnabled(false);
      return;
    }
    setShowExperimentalPopup(true);
    setBetaInput("");
    setBetaError(undefined);
  };

  const handleEnableRealMode = async () => {
    if (betaInput.trim().toLowerCase() !== "beta") {
      setBetaError("Type beta to continue.");
      return;
    }

    setRealModeEnabled(true);
    await startRealPairing();
    setShowExperimentalPopup(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/30">
      <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream-50 p-6 pb-8 shadow-card">
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
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-ink-900">Connect to openclaw-real</div>
                <div className="text-xs text-ink-600">Experimental relay mode for ClawPC connection</div>
              </div>
              <button
                onClick={handleToggleRealMode}
                className={`h-7 w-12 rounded-full p-1 transition ${realModeEnabled ? "bg-mint-300" : "bg-cream-200"}`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-cream-50 shadow transition ${
                    realModeEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div className="mt-3 text-xs text-ink-600">Status: {statusText(realConnectionStatus)}</div>
            {realModeEnabled ? (
              <div className="mt-3 rounded-xl bg-cream-50 p-3 text-xs text-ink-700">
                {realPairingCode ? <div>Pair code: <span className="font-mono font-semibold">{realPairingCode}</span></div> : null}
                {realPairingExpiresAt ? <div className="mt-1">Expires: {new Date(realPairingExpiresAt).toLocaleTimeString()}</div> : null}
                {realSetupCommand ? (
                  <div className="mt-2 rounded-lg bg-cream-100 px-2 py-2 font-mono text-[11px] text-ink-700">
                    {realSetupCommand}
                  </div>
                ) : null}
                {realError ? <div className="mt-2 text-rose-700">{realError}</div> : null}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => void refreshRealPairing()}
                    className="rounded-xl bg-cream-200 px-3 py-2 text-xs font-semibold text-ink-700"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => void confirmRealPairing()}
                    className="rounded-xl bg-mint-200 px-3 py-2 text-xs font-semibold text-ink-900"
                  >
                    I Ran This on ClawPC
                  </button>
                </div>
              </div>
            ) : null}
          </div>

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

      {showExperimentalPopup ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/45 px-6">
          <div className="w-full max-w-sm rounded-3xl bg-cream-50 p-5 shadow-card">
            <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Experimental</div>
            <div className="mt-1 font-display text-lg font-semibold text-ink-900">openclaw-real</div>
            <p className="mt-2 text-sm text-ink-700">
              This mode is experimental. Type <span className="font-mono">beta</span> to continue.
            </p>
            <input
              value={betaInput}
              onChange={(event) => setBetaInput(event.target.value)}
              placeholder="Type beta"
              className="mt-4 w-full rounded-2xl border border-cream-200 bg-cream-100 px-3 py-2 text-sm outline-none"
            />
            {betaError ? <div className="mt-2 text-xs text-rose-700">{betaError}</div> : null}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowExperimentalPopup(false)}
                className="rounded-2xl bg-cream-200 px-3 py-2 text-sm font-semibold text-ink-700"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleEnableRealMode()}
                className="rounded-2xl bg-mint-400 px-3 py-2 text-sm font-semibold text-ink-900"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
