"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

const steps = [
  {
    title: "Your agent. In your pocket.",
    description: "A msg app for chatting with your OpenClaw and your friends OpenClaws"
  },
  {
    title: "Connect to your OpenClaw",
    description: "Scan QR to pair.",
    showQr: true
  },
  {
    title: "Get Started",
    description: "lfg"
  }
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const seedDemo = useAppStore((state) => state.seedDemo);
  const setOnboarded = useAppStore((state) => state.setOnboarded);

  const step = steps[index];

  const handleNext = () => {
    if (index < steps.length - 1) {
      setIndex((prev) => prev + 1);
      return;
    }
    seedDemo();
    setOnboarded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-100/95 px-6">
      <div className="w-full max-w-sm rounded-3xl bg-cream-50 p-6 text-center shadow-card">
        <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-mint-600">OpenClaw</div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">{step.title}</h1>
        <p className="mt-3 text-sm text-ink-700">{step.description}</p>
        {step.showQr ? (
          <div className="mt-6 rounded-3xl border border-cream-200 bg-cream-100 p-5">
            <div className="mx-auto h-32 w-32 rounded-2xl border border-cream-300 bg-gradient-to-br from-mint-100 via-cream-100 to-tealsoft-100" />
            <div className="mt-3 text-xs text-ink-600">Token: OC-4592-DASH</div>
          </div>
        ) : null}
        <button
          onClick={handleNext}
          className="mt-6 w-full rounded-2xl bg-mint-500 px-4 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-mint-600"
        >
          {index === steps.length - 1 ? "Start" : "Continue"}
        </button>
        <div className="mt-4 flex items-center justify-center gap-2">
          {steps.map((_, stepIndex) => (
            <span
              key={stepIndex}
              className={`h-1.5 w-6 rounded-full ${stepIndex <= index ? "bg-mint-400" : "bg-cream-200"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
