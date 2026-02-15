"use client";

import { useMemo, useState } from "react";

export default function PlanBlock({ steps }: { steps: string[] }) {
  const [editable, setEditable] = useState(false);
  const [localSteps, setLocalSteps] = useState(() => steps);

  const displaySteps = useMemo(() => (editable ? localSteps : steps), [editable, localSteps, steps]);

  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-100 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Plan</div>
        <button
          onClick={() => setEditable((prev) => !prev)}
          className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-ink-700"
        >
          {editable ? "Lock" : "Editable"}
        </button>
      </div>
      <ol className="mt-3 grid gap-2 text-sm text-ink-800">
        {displaySteps.map((step, index) => (
          <li key={index} className="flex gap-3">
            <span className="h-6 w-6 rounded-full bg-mint-100 text-center text-xs font-semibold leading-6 text-mint-600">
              {index + 1}
            </span>
            {editable ? (
              <input
                value={localSteps[index] ?? step}
                onChange={(event) => {
                  const next = [...localSteps];
                  next[index] = event.target.value;
                  setLocalSteps(next);
                }}
                className="w-full rounded-xl border border-cream-200 bg-cream-50 px-3 py-2 text-sm"
              />
            ) : (
              <span className="pt-1">{step}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
