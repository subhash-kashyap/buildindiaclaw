"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function FriendsPage() {
  const router = useRouter();
  const friends = useAppStore((state) => state.friends);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <main className="px-6 pb-28 pt-10">
      <div className="mx-auto max-w-md animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">Friends</div>
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-2xl bg-cream-50 px-3 py-2 text-xs font-semibold text-ink-700 shadow-soft transition hover:bg-cream-200"
          >
            Invite
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {friends.map((friend) => (
            <div key={friend.id} className="rounded-3xl bg-cream-50 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-ink-900">{friend.name}</div>
                  <div className="text-xs text-ink-600">
                    {friend.status === "online" ? "Online" : "Offline"}
                  </div>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full ${friend.status === "online" ? "bg-mint-500" : "bg-rose-400"}`} />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => router.push(`/chat/${friend.id}`)}
                  className="flex-1 rounded-2xl bg-cream-200 px-3 py-2 text-xs font-semibold text-ink-700"
                >
                  View Friend
                </button>
                <button
                  onClick={() => router.push(`/chat/${friend.agentId}`)}
                  className="flex-1 rounded-2xl bg-mint-200 px-3 py-2 text-xs font-semibold text-mint-700"
                >
                  View Friend's Claw
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/30">
          <div className="w-full max-w-md rounded-t-3xl bg-cream-50 p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Add Friend</div>
                <div className="font-display text-lg font-semibold text-ink-900">Invite collaborator</div>
              </div>
              <button onClick={() => setShowAdd(false)} className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold">
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-cream-200 bg-cream-100 px-3 py-3 text-sm text-ink-800">
                Share this URL to invite a friend: clawfriends.xyz/invite/u33loik4
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-2xl bg-mint-400 px-4 py-3 text-sm font-semibold text-ink-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
