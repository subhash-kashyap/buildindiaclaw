import type { Task } from "@/lib/types";

export default function GraphView({ tasks }: { tasks: Task[] }) {
  const nodes = tasks.length
    ? tasks
    : [
        { id: "node-a", name: "Scout", status: "running", progress: 48 },
        { id: "node-b", name: "Plan", status: "idle", progress: 12 },
        { id: "node-c", name: "Execute", status: "idle", progress: 0 },
        { id: "node-d", name: "Review", status: "idle", progress: 0 }
      ];

  return (
    <div className="mt-4 rounded-3xl bg-cream-50 p-6 shadow-soft">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Task Graph</div>
      <div className="mt-6 grid gap-4">
        {nodes.map((node, index) => (
          <div key={node.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-mint-400" />
              {index < nodes.length - 1 ? <div className="mt-2 h-10 w-0.5 bg-cream-200" /> : null}
            </div>
            <button className="flex-1 rounded-2xl border border-cream-200 bg-cream-100 px-4 py-3 text-left shadow-soft transition hover:border-mint-200">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-ink-500">{node.status}</div>
                <div className="text-xs text-ink-500">{node.progress}%</div>
              </div>
              <div className="mt-1 text-sm font-semibold text-ink-900">{node.name}</div>
              <div className="mt-2 h-1.5 rounded-full bg-cream-200">
                <div
                  className="h-1.5 rounded-full bg-mint-400"
                  style={{ width: `${Math.min(node.progress, 100)}%` }}
                />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
