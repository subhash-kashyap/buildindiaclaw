"use client";

import type { Conversation } from "@/lib/types";

export default function ConversationList({
  conversations,
  activeId,
  onSelect
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-4 grid gap-2">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`rounded-2xl border px-4 py-3 text-left transition ${
            activeId === conv.id
              ? "border-mint-300 bg-mint-100"
              : "border-cream-200 bg-cream-50 hover:border-mint-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-ink-900">{conv.title}</div>
            <div className="text-xs text-ink-500">{conv.updatedAt ? "Updated" : ""}</div>
          </div>
          {conv.summary ? <div className="mt-1 text-xs text-ink-600">{conv.summary}</div> : null}
        </button>
      ))}
    </div>
  );
}
