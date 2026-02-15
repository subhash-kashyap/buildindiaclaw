"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppStore } from "@/lib/store";

export default function MemoryPage() {
  const memory = useAppStore((state) => state.memory);

  const longTerm = useMemo(() => memory.filter((entry) => entry.tier === "long_term"), [memory]);
  const shortTerm = useMemo(() => memory.filter((entry) => entry.tier === "short_term"), [memory]);

  return (
    <main className="px-6 pb-28 pt-10">
      <div className="mx-auto max-w-md animate-fade-up">
        <div className="rounded-3xl bg-cream-50 p-5 shadow-card">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Memory</div>
          <div className="mt-2 font-display text-lg font-semibold text-ink-900">File Vault</div>
          <div className="mt-1 text-xs text-ink-600">Long-form markdown archives and daily logs.</div>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="rounded-3xl bg-cream-50 p-4 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Long-Term</div>
            <div className="mt-3 grid gap-2">
              {longTerm.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/memory/${entry.id}`}
                  className="rounded-2xl border border-cream-200 bg-cream-50 px-3 py-2 text-left transition hover:border-mint-200"
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

          <div className="rounded-3xl bg-cream-50 p-4 shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Short-Term</div>
            <div className="mt-3 grid gap-2">
              {shortTerm.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/memory/${entry.id}`}
                  className="rounded-2xl border border-cream-200 bg-cream-50 px-3 py-2 text-left transition hover:border-mint-200"
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
        </div>
      </div>
    </main>
  );
}
