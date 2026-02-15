"use client";

import type { Agent } from "@/lib/types";

export default function AgentSelector({
  agents,
  onClose,
  onSelect
}: {
  agents: Agent[];
  onClose: () => void;
  onSelect: (agentId: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink-900/30">
      <div className="flex w-full max-w-md max-h-[80vh] flex-col rounded-t-3xl bg-cream-50 p-6 pb-10 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Select Claw</div>
            <div className="font-display text-lg font-semibold text-ink-900">Your Agents</div>
          </div>
          <button onClick={onClose} className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold">
            Close
          </button>
        </div>
        <div className="mt-5 grid max-h-[52vh] gap-3 overflow-y-auto pb-8 pr-1 scrollbar-hidden">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className="rounded-2xl border border-cream-200 bg-cream-100 px-4 py-3 text-left transition hover:border-mint-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-ink-900">{agent.name}</div>
                  <div className="text-xs text-ink-500">{agent.api}</div>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full ${agent.status === "online" ? "bg-mint-500" : "bg-rose-400"}`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
