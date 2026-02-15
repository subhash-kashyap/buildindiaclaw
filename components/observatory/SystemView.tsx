import { useEffect, useMemo, useState } from "react";
import type { Task } from "@/lib/types";

function meter(value: number) {
  return Math.min(100, Math.max(0, value));
}

export default function SystemView({ tasks }: { tasks: Task[] }) {
  const [cpu, setCpu] = useState(32);
  const [ram, setRam] = useState(9.6);
  const [net, setNet] = useState(42);

  const activeTasks = useMemo(() => tasks.filter((task) => task.status === "running").length, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpu((prev) => meter(prev + (Math.random() * 8 - 4)));
      setRam((prev) => Math.max(6, Math.min(14, prev + (Math.random() * 0.6 - 0.3))));
      setNet((prev) => meter(prev + (Math.random() * 10 - 5)));
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-4 grid gap-3">
      <div className="rounded-2xl bg-cream-50 p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-500">CPU</div>
          <div className="text-sm font-semibold text-ink-900">{Math.round(cpu)}%</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-cream-200">
          <div className="h-2 rounded-full bg-mint-400 transition-all" style={{ width: `${cpu}%` }} />
        </div>
      </div>
      <div className="rounded-2xl bg-cream-50 p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-500">RAM</div>
          <div className="text-sm font-semibold text-ink-900">{ram.toFixed(1)} GB</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-cream-200">
          <div className="h-2 rounded-full bg-tealsoft-300 transition-all" style={{ width: `${(ram / 14) * 100}%` }} />
        </div>
      </div>
      <div className="rounded-2xl bg-cream-50 p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Network</div>
          <div className="text-sm font-semibold text-ink-900">{Math.round(net)}%</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-cream-200">
          <div className="h-2 rounded-full bg-mint-300 transition-all" style={{ width: `${net}%` }} />
        </div>
      </div>
      <div className="rounded-2xl bg-cream-50 p-4 shadow-soft">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Active Tasks</div>
        <div className="mt-2 text-2xl font-semibold text-ink-900">{activeTasks}</div>
        <div className="mt-1 text-xs text-ink-600">Dynamic load detected</div>
      </div>
    </div>
  );
}
