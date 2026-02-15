"use client";

import { useEffect, useState } from "react";

export default function LogsStream({ lines }: { lines: string[] }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (!lines.length) return;

    const timeouts: NodeJS.Timeout[] = [];
    lines.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleCount((prev) => Math.max(prev, index + 1));
      }, 350 * (index + 1));
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [lines]);

  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-100 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Logs</div>
      <div className="mt-3 space-y-2 font-mono text-xs text-ink-800">
        {lines.slice(0, visibleCount).map((line, index) => (
          <div key={index} className="rounded-xl bg-cream-50 px-3 py-2">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
