"use client";

import { useState } from "react";
import type { EventItem } from "@/lib/types";

const toneMap: Record<EventItem["type"], string> = {
  Execution: "bg-mint-100 text-ink-800",
  Planning: "bg-cream-200 text-ink-800",
  Failure: "bg-rose-100 text-rose-900",
  Meta: "bg-tealsoft-100 text-ink-800",
  System: "bg-cream-200 text-ink-800"
};

export default function ActivityFeed({ events }: { events: EventItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="mt-6 grid gap-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-2xl bg-cream-50 px-4 py-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
          onClick={() => setExpandedId((prev) => (prev === event.id ? null : event.id))}
        >
          <div className="flex items-center justify-between">
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${toneMap[event.type]}`}>
              {event.type}
            </span>
            <span className="text-xs text-ink-500">{event.time}</span>
          </div>
          <div className="mt-2 text-sm font-medium text-ink-800">{event.description}</div>
          {expandedId === event.id ? (
            <div className="mt-3 rounded-xl bg-cream-100 px-3 py-2 text-xs text-ink-700">
              <div className="text-[10px] uppercase tracking-[0.2em] text-ink-500">Logs tail -10</div>
              <div className="mt-2 space-y-1 font-mono">
                {(event.logs ?? ["[info] no logs available"]).slice(-10).map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-ink-400">View more</div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
