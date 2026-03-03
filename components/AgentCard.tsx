"use client";

import type { Agent } from "@/lib/types";
import { trackClick } from "@/lib/analytics";

export default function AgentCard({
  agent,
  onOpen,
  onSelect
}: {
  agent: Agent;
  onOpen: () => void;
  onSelect: () => void;
}) {
  const online = agent.status === "online";
  return (
    <div className="rounded-3xl bg-cream-50 p-5 shadow-card transition-all duration-300 hover:shadow-soft">
      <button 
        onClick={() => {
          trackClick('Agent Card', { agent: agent.name });
          onSelect();
        }} 
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ink-600">Primary Claw</div>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink-900">{agent.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-cream-100 px-3 py-1 text-xs font-semibold text-ink-700">
              <span className={`h-2 w-2 rounded-full ${online ? "bg-mint-500" : "bg-rose-400"}`} />
              {online ? "ONLINE" : "OFFLINE"}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                trackClick('Agent Options', { agent: agent.name });
                alert(`${agent.name} options`);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-cream-200"
              aria-label="Options"
            >
              <div className="flex gap-0.5">
                <div className="h-1 w-1 rounded-full bg-ink-400" />
                <div className="h-1 w-1 rounded-full bg-ink-400" />
                <div className="h-1 w-1 rounded-full bg-ink-400" />
              </div>
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-ink-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Last Task</div>
              <div className="font-medium">{agent.lastSummary ?? "No recent summary"}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Active Tasks</div>
              <div className="font-semibold text-ink-900">{agent.activeTasks}</div>
            </div>
            {agent.tokensConsumed !== undefined ? (
              <div className="text-right">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Tokens</div>
                <div className="font-semibold text-ink-900">
                  {agent.tokensConsumed.toLocaleString()} / {agent.tokenLimit?.toLocaleString()}
                </div>
              </div>
            ) : !online ? (
              <div className="text-right text-xs text-ink-600">
                <div>Last seen {agent.lastSeen ?? "Unknown"}</div>
                <div>{agent.queuedDrafts ?? 0} drafts queued</div>
              </div>
            ) : null}
          </div>
        </div>
      </button>
    </div>
  );
}
