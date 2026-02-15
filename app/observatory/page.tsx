"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import ObservatoryTabs, { ObservatoryTab } from "@/components/observatory/ObservatoryTabs";
import TimelineView from "@/components/observatory/TimelineView";
import GraphView from "@/components/observatory/GraphView";
import SystemView from "@/components/observatory/SystemView";
import CronSchedule from "@/components/observatory/CronSchedule";
import MemoryPanel from "@/components/observatory/MemoryPanel";

export default function ObservatoryPage() {
  const [tab, setTab] = useState<ObservatoryTab>("Timeline");
  const events = useAppStore((state) => state.events);
  const tasks = useAppStore((state) => state.tasks);
  const agents = useAppStore((state) => state.agents);
  const crons = useAppStore((state) => state.crons);
  const memory = useAppStore((state) => state.memory);

  const primaryAgent = useMemo(() => agents[0], [agents]);

  return (
    <main className="px-6 pb-28 pt-10">
      <div className="mx-auto max-w-md animate-fade-up">
        <div className="rounded-3xl bg-cream-50 p-5 shadow-card">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Observatory</div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-semibold text-ink-900">System Snapshot</div>
              <div className="text-xs text-ink-600">Primary agent telemetry</div>
            </div>
            <span className={`h-2.5 w-2.5 rounded-full ${primaryAgent?.status === "online" ? "bg-mint-500" : "bg-rose-400"}`} />
          </div>
        </div>

        {primaryAgent?.status === "offline" ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-soft">
            Agent unreachable.
          </div>
        ) : null}

        <div className="mt-6">
          <ObservatoryTabs active={tab} onChange={setTab} />

          {tab === "Timeline" ? <TimelineView events={events} /> : null}
          {tab === "Graph" ? <GraphView tasks={tasks} /> : null}
          {tab === "System" ? (
            <>
              <SystemView tasks={tasks} />
              <CronSchedule jobs={crons} />
            </>
          ) : null}
          {tab === "Memory" ? <MemoryPanel memory={memory} /> : null}
        </div>
      </div>
    </main>
  );
}
