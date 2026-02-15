"use client";

const statusTone: Record<string, string> = {
  planning: "bg-cream-200 text-ink-700",
  running: "bg-mint-200 text-mint-700",
  failed: "bg-rose-200 text-rose-700",
  done: "bg-mint-100 text-mint-700",
  refused: "bg-rose-100 text-rose-700"
};

export default function CommandBlock({
  commands,
  status,
  onBranch
}: {
  commands: string[];
  status: string;
  onBranch: () => void;
}) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-100 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Commands</div>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusTone[status] ?? "bg-cream-200"}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <div className="mt-3 space-y-2 font-mono text-xs text-ink-800">
        {commands.map((command, index) => (
          <div key={index} className="rounded-xl bg-cream-50 px-3 py-2">
            {command}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-xl bg-cream-200 px-3 py-2 text-xs font-semibold text-ink-700">
          Pause
        </button>
        <button
          onClick={onBranch}
          className="flex-1 rounded-xl bg-mint-200 px-3 py-2 text-xs font-semibold text-mint-700"
        >
          Branch
        </button>
      </div>
    </div>
  );
}
