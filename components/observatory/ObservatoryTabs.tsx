"use client";

const tabs = ["Timeline", "Graph", "System", "Memory"] as const;

export type ObservatoryTab = (typeof tabs)[number];

export default function ObservatoryTabs({
  active,
  onChange
}: {
  active: ObservatoryTab;
  onChange: (tab: ObservatoryTab) => void;
}) {
  return (
    <div className="flex gap-2 rounded-2xl bg-cream-50 p-2 shadow-soft">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
            active === tab ? "bg-mint-200 text-ink-900" : "text-ink-600 hover:bg-cream-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
