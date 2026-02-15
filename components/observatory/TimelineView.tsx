import type { EventItem } from "@/lib/types";

export default function TimelineView({ events }: { events: EventItem[] }) {
  return (
    <div className="mt-4 grid gap-3">
      {events.map((event) => (
        <div key={event.id} className="rounded-2xl bg-cream-50 p-4 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.2em] text-ink-500">{event.type}</div>
            <div className="text-xs text-ink-500">{event.time}</div>
          </div>
          <div className="mt-2 text-sm font-medium text-ink-800">{event.description}</div>
        </div>
      ))}
    </div>
  );
}
