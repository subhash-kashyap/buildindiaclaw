"use client";

import { useState } from "react";
import ActivityFeed from "./ActivityFeed";
import type { EventItem } from "@/lib/types";

export default function ActivityToggle({ events }: { events: EventItem[] }) {
  const [view, setView] = useState<"video" | "list">("video");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-600">
          What's Happening
        </div>
        <div className="flex rounded-full bg-cream-100 p-1 shadow-inner">
          <button
            onClick={() => setView("video")}
            className={`rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
              view === "video"
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-400 hover:text-ink-600"
            }`}
          >
            Video
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
              view === "list"
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-400 hover:text-ink-600"
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-cream-50 shadow-soft transition-all duration-500">
        {view === "video" ? (
          <div className="flex h-full min-h-[300px] items-center justify-center bg-black/5 animate-fade-in">
             {/* 
                Placeholder for clawfriendshome video/gif. 
                Using a descriptive placeholder if file not found.
             */}
             <div className="relative h-full w-full overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                </div>
                {/* 
                   If the user provides the video file, we can swap the div below for a <video> or <img> tag.
                   Assuming clawfriendshome.mp4 or clawfriendshome.gif might be placed in /public.
                */}
                <img 
                    src="/clawfriendshome.gif" 
                    alt="Claw Friends Home" 
                    className="h-full w-full object-cover opacity-0 transition-opacity duration-300"
                    onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                />
             </div>
          </div>
        ) : (
          <div className="animate-fade-in p-1">
            <ActivityFeed events={events} />
          </div>
        )}
      </div>
    </div>
  );
}
