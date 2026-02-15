"use client";

import { useState } from "react";

export default function ChatComposer({
  disabled,
  onSend,
  branchFrom
}: {
  disabled: boolean;
  onSend: (content: string) => void;
  branchFrom?: string;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="fixed bottom-24 left-1/2 z-30 w-[92%] max-w-md -translate-x-1/2">
      <div className="rounded-3xl bg-cream-50 p-3 shadow-card">
        {branchFrom ? (
          <div className="mb-2 rounded-2xl bg-cream-200 px-3 py-2 text-xs font-semibold text-ink-700">
            Branching from message {branchFrom.slice(0, 6)}
          </div>
        ) : null}
        <div className="flex items-end gap-2">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={disabled ? "Claw offline. Drafts will queue." : "Type a message"}
            className="h-16 flex-1 resize-none rounded-2xl border border-cream-200 bg-cream-100 px-3 py-2 text-sm text-ink-800 outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={disabled}
            className={`rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] ${
              disabled ? "bg-cream-300 text-cream-50" : "bg-ink-900 text-cream-50"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
