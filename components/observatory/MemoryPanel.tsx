import Link from "next/link";
import type { MemoryEntry } from "@/lib/types";

export default function MemoryPanel({ memory }: { memory: MemoryEntry[] }) {
  const items = memory.slice(0, 6);
  return (
    <div className="mt-4 rounded-3xl bg-cream-50 p-4 shadow-soft">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Memory Files</div>
      <div className="mt-3 grid gap-2">
        {items.map((entry) => (
          <Link
            key={entry.id}
            href={`/memory/${entry.id}`}
            className="rounded-2xl border border-cream-200 bg-cream-100 px-3 py-2 text-left transition hover:border-mint-200"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-ink-900">{entry.title}</div>
              <div className="text-[10px] text-ink-500">{entry.size}</div>
            </div>
            <div className="mt-1 text-[10px] text-ink-600">{entry.updatedAt}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
