"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";
import PlanBlock from "./PlanBlock";
import CommandBlock from "./CommandBlock";
import LogsStream from "./LogsStream";

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBlock({
  message,
  onBranch,
  showAdvanced = true,
  agentLabel = "Panda"
}: {
  message: Message;
  onBranch: () => void;
  showAdvanced?: boolean;
  agentLabel?: string;
}) {
  const isAgent = message.role === "agent";
  const [showReasoning, setShowReasoning] = useState(false);
  const timeLabel = formatTime(message.createdAt);

  return (
    <div
      className={`max-w-[85%] rounded-3xl ${isAgent ? "bg-cream-50" : "bg-mint-100"} p-4 shadow-soft transition-all duration-300 ${
        isAgent ? "" : "ml-auto"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-500">
          {isAgent ? agentLabel : "You"}
        </div>
        <div className="flex items-center gap-2">
          {timeLabel ? <span className="text-[10px] text-ink-400">{timeLabel}</span> : null}
          {message.status === "queued" ? (
            <span className="rounded-full bg-cream-200 px-2 py-1 text-[10px] font-semibold text-ink-700">
              Queued
            </span>
          ) : null}
          {message.parentMessageId ? (
            <span className="rounded-full bg-cream-200 px-2 py-1 text-[10px] font-semibold text-ink-700">
              Branch
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-2 text-sm text-ink-900">{message.content}</div>

      {isAgent && showAdvanced && (message.rawReasoning || message.plan?.length || message.commands?.length || message.logs?.length) ? (
        <div className="mt-4 rounded-2xl border border-cream-200 bg-cream-100 p-4">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-500">Details</div>
            <button
              onClick={() => setShowReasoning((prev) => !prev)}
              className="text-[11px] font-semibold text-ink-500 underline underline-offset-4"
            >
              {showReasoning ? "Hide" : "Expand"}
            </button>
          </div>
          {showReasoning ? (
            <div className="mt-3 grid gap-3">
              {message.rawReasoning ? (
                <p className="rounded-xl bg-cream-50 px-3 py-2 text-xs text-ink-600">{message.rawReasoning}</p>
              ) : null}
              {message.plan?.length ? <PlanBlock steps={message.plan} /> : null}
              {message.commands?.length ? (
                <CommandBlock commands={message.commands} status={message.status ?? "planning"} onBranch={onBranch} />
              ) : null}
              {message.logs?.length ? <LogsStream lines={message.logs} /> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
