"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import AgentCard from "@/components/AgentCard";
import ActivityToggle from "@/components/ActivityToggle";
import Onboarding from "@/components/Onboarding";
import AgentSelector from "@/components/AgentSelector";
import SettingsSheet from "@/components/SettingsSheet";

export default function HomePage() {
  const router = useRouter();
  const hasOnboarded = useAppStore((state) => state.hasOnboarded);
  const agents = useAppStore((state) => state.agents);
  const events = useAppStore((state) => state.events);
  const [showSelector, setShowSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const primaryAgent = useMemo(() => agents[0], [agents]);

  const handleSelect = () => {
    if (!primaryAgent) return;
    setShowSelector(true);
  };

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <main className="px-6 pb-28 pt-10">
      <div className="mx-auto max-w-md space-y-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Home</div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            ...
          </button>
        </div>
        <ActivityToggle events={events} />
        {primaryAgent ? (
          <AgentCard agent={primaryAgent} onOpen={handleSelect} onSelect={handleSelect} />
        ) : (
          <div className="rounded-3xl bg-cream-50 p-6 shadow-card">
            <div className="text-sm text-ink-600">No agents yet. Start the demo to seed data.</div>
          </div>
        )}
      </div>

      {showSelector ? (
        <AgentSelector
          agents={agents.filter((agent) => agent.type === "self").slice(0, 5)}
          onClose={() => setShowSelector(false)}
          onSelect={(agentId) => router.push(`/chat/${agentId}`)}
        />
      ) : null}

      {showSettings ? <SettingsSheet onClose={() => setShowSettings(false)} /> : null}
    </main>
  );
}
