"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useAppStore } from "@/lib/store";

export default function MemoryFilePage() {
  const params = useParams();
  const memoryId = params.memoryId as string;
  const memory = useAppStore((state) => state.memory);
  const updateMemoryFile = useAppStore((state) => state.updateMemoryFile);

  const entry = useMemo(() => memory.find((item) => item.id === memoryId), [memory, memoryId]);

  return (
    <main className="px-6 pb-28 pt-10">
      <div className="mx-auto max-w-md animate-fade-up">
        <div className="rounded-3xl bg-cream-50 p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Memory File</div>
              <div className="mt-1 font-display text-lg font-semibold text-ink-900">{entry?.path ?? ""}</div>
            </div>
            <Link
              href="/memory"
              className="rounded-2xl bg-cream-200 px-3 py-2 text-xs font-semibold text-ink-700"
            >
              Back
            </Link>
          </div>
          <div className="mt-2 text-xs text-ink-600">
            {entry?.updatedAt} | {entry?.size} | Markdown
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-cream-50 p-4 shadow-soft">
          <textarea
            value={entry?.content ?? ""}
            onChange={(event) => entry && updateMemoryFile(entry.id, event.target.value)}
            className="min-h-[360px] w-full resize-none rounded-2xl border border-cream-200 bg-cream-100 px-3 py-3 text-sm text-ink-800 outline-none"
          />
        </div>
      </div>
    </main>
  );
}
