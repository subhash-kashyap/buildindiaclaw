"use client";

import { create } from "zustand";
import type { Agent, Conversation, CronJob, EventItem, Friend, MemoryEntry, Message, Task } from "./types";
import {
  initialAgents,
  initialConversations,
  initialEvents,
  initialFriends,
  initialMemory,
  initialMessages,
  initialTasks,
  initialCrons
} from "./sampleData";
import { simulateAgentResponse } from "./mockEngine";
import { simulateRealAgentResponse } from "./realEngine";

const uid = () => `id-${Math.random().toString(36).slice(2, 10)}`;

type RealConnectionStatus = "disconnected" | "pairing" | "connected" | "error";

export type AppState = {
  hasOnboarded: boolean;
  demoMode: boolean;
  realModeEnabled: boolean;
  realConnectionStatus: RealConnectionStatus;
  realPairingId?: string;
  realPairingCode?: string;
  realSetupCommand?: string;
  realPairingExpiresAt?: string;
  realError?: string;
  agents: Agent[];
  friends: Friend[];
  conversations: Conversation[];
  messages: Message[];
  tasks: Task[];
  events: EventItem[];
  crons: CronJob[];
  memory: MemoryEntry[];
  typingByConversation: Record<string, boolean>;
  activeBranchFrom?: string;
  setOnboarded: (value: boolean) => void;
  seedDemo: () => void;
  setDemoMode: (value: boolean) => void;
  resetDemo: () => void;
  setRealModeEnabled: (value: boolean) => void;
  startRealPairing: () => Promise<void>;
  refreshRealPairing: () => Promise<void>;
  confirmRealPairing: () => Promise<void>;
  restoreRealState: (data: { enabled: boolean; pairingId?: string }) => void;
  toggleAgentStatus: (agentId: string, nextStatus: Agent["status"]) => void;
  restartAgent: (agentId: string) => void;
  addFriend: (name: string) => void;
  ensureConversation: (agentId: string) => string;
  updateMemoryFile: (id: string, content: string) => void;
  setActiveBranchFrom: (messageId?: string) => void;
  setTyping: (conversationId: string, value: boolean) => void;
  sendMessage: (params: {
    agentId: string;
    conversationId: string;
    content: string;
    parentMessageId?: string;
  }) => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  hasOnboarded: false,
  demoMode: true,
  realModeEnabled: false,
  realConnectionStatus: "disconnected",
  agents: [],
  friends: [],
  conversations: [],
  messages: [],
  tasks: [],
  events: [],
  crons: [],
  memory: [],
  typingByConversation: {},
  setOnboarded: (value) => {
    set({ hasOnboarded: value });
    if (typeof window !== "undefined") {
      localStorage.setItem("openclaw:onboarded", value ? "1" : "0");
    }
  },
  seedDemo: () => {
    set({
      agents: initialAgents,
      friends: initialFriends,
      conversations: initialConversations,
      messages: initialMessages,
      tasks: initialTasks,
      events: initialEvents,
      crons: initialCrons,
      memory: initialMemory
    });
  },
  setDemoMode: (value) => {
    set({ demoMode: value });
    if (typeof window !== "undefined") {
      localStorage.setItem("openclaw:demo", value ? "1" : "0");
    }
    if (value) {
      set({
        agents: initialAgents,
        friends: initialFriends,
        conversations: initialConversations,
        messages: initialMessages,
        tasks: initialTasks,
        events: initialEvents,
        memory: initialMemory,
        crons: initialCrons
      });
    } else {
      set({
        conversations: [],
        messages: [],
        tasks: [],
        events: [],
        crons: []
      });
    }
  },
  resetDemo: () => {
    set({ hasOnboarded: false, demoMode: true });
    if (typeof window !== "undefined") {
      localStorage.setItem("openclaw:onboarded", "0");
      localStorage.setItem("openclaw:demo", "1");
    }
    set({
      agents: [],
      friends: [],
      conversations: [],
      messages: [],
      tasks: [],
      events: [],
      crons: [],
      memory: []
    });
  },
  setRealModeEnabled: (value) => {
    set({ realModeEnabled: value });
    if (typeof window !== "undefined") {
      localStorage.setItem("openclaw:realMode", value ? "1" : "0");
    }
    if (!value) {
      set({
        realConnectionStatus: "disconnected",
        realError: undefined
      });
    } else if (!get().realPairingId) {
      set({ realConnectionStatus: "pairing" });
    }
  },
  startRealPairing: async () => {
    set({ realConnectionStatus: "pairing", realError: undefined });
    try {
      const response = await fetch("/api/openclaw-real/pairings", { method: "POST" });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to start pairing");
      }
      const data = await response.json();
      set({
        realPairingId: data.id,
        realPairingCode: data.code,
        realSetupCommand: data.command,
        realPairingExpiresAt: data.expiresAt,
        realConnectionStatus: data.status === "connected" ? "connected" : "pairing"
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("openclaw:realPairingId", data.id);
      }
    } catch (error) {
      set({
        realConnectionStatus: "error",
        realError: error instanceof Error ? error.message : "Failed to start pairing"
      });
    }
  },
  refreshRealPairing: async () => {
    const pairingId = get().realPairingId;
    if (!pairingId) return;

    try {
      const response = await fetch(`/api/openclaw-real/pairings/${pairingId}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to refresh pairing");
      }
      const data = await response.json();
      set({
        realPairingCode: data.code,
        realSetupCommand: data.command,
        realPairingExpiresAt: data.expiresAt,
        realConnectionStatus:
          data.status === "connected"
            ? "connected"
            : data.status === "expired"
            ? "error"
            : "pairing",
        realError: data.status === "expired" ? "Pairing session expired. Start again." : undefined
      });
    } catch (error) {
      set({
        realConnectionStatus: "error",
        realError: error instanceof Error ? error.message : "Failed to refresh pairing"
      });
    }
  },
  confirmRealPairing: async () => {
    const pairingId = get().realPairingId;
    if (!pairingId) return;

    try {
      const response = await fetch(`/api/openclaw-real/pairings/${pairingId}/confirm`, {
        method: "POST"
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to confirm pairing");
      }
      await get().refreshRealPairing();
    } catch (error) {
      set({
        realConnectionStatus: "error",
        realError: error instanceof Error ? error.message : "Failed to confirm pairing"
      });
    }
  },
  restoreRealState: ({ enabled, pairingId }) => {
    set({
      realModeEnabled: enabled,
      realPairingId: pairingId,
      realConnectionStatus: enabled ? "pairing" : "disconnected"
    });
  },
  toggleAgentStatus: (agentId, nextStatus) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, status: nextStatus } : agent
      )
    }));
  },
  restartAgent: (agentId) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === agentId ? { ...agent, status: "offline", lastSeen: "restarting..." } : agent
      )
    }));
    setTimeout(() => {
      set((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === agentId ? { ...agent, status: "online", lastSummary: "Restart complete" } : agent
        ),
        events: [
          {
            id: uid(),
            agentId,
            type: "System",
            description: "Agent restart completed",
            time: "Just now"
          },
          ...state.events
        ]
      }));
    }, 1400);
  },
  addFriend: (name) => {
    const friendId = uid();
    const clawId = uid();
    const newFriend: Friend = { id: friendId, name, status: "offline", agentId: clawId };
    const newFriendAgent: Agent = {
      id: friendId,
      name,
      type: "friend",
      status: "offline",
      api: "Anthropic Sonnet",
      lastSummary: "Pending first sync",
      activeTasks: 0
    };
    const newClaw: Agent = {
      id: clawId,
      name: `${name}'s Claw`,
      type: "friend_claw",
      status: "offline",
      api: "Anthropic Sonnet",
      lastSummary: "Awaiting permission",
      activeTasks: 0
    };
    set((state) => ({
      friends: [...state.friends, newFriend],
      agents: [...state.agents, newFriendAgent, newClaw],
      conversations: [
        ...state.conversations,
        { id: uid(), agentId: friendId, title: name },
        { id: uid(), agentId: clawId, title: `${name}'s Claw` }
      ]
    }));
  },
  ensureConversation: (agentId) => {
    const existing = get().conversations.find((item) => item.agentId === agentId);
    if (existing) return existing.id;
    const agent = get().agents.find((item) => item.id === agentId);
    const next: Conversation = {
      id: uid(),
      agentId,
      title: agent?.name ?? "Conversation"
    };
    set((state) => ({ conversations: [...state.conversations, next] }));
    return next.id;
  },
  updateMemoryFile: (id, content) => {
    set((state) => ({
      memory: state.memory.map((entry) => (entry.id === id ? { ...entry, content } : entry))
    }));
  },
  setActiveBranchFrom: (messageId) => set({ activeBranchFrom: messageId }),
  setTyping: (conversationId, value) => {
    set((state) => ({
      typingByConversation: { ...state.typingByConversation, [conversationId]: value }
    }));
  },
  sendMessage: async ({ agentId, conversationId, content, parentMessageId }) => {
    const now = new Date().toISOString();
    const userMessage: Message = {
      id: uid(),
      conversationId,
      agentId,
      role: "user",
      content,
      createdAt: now,
      parentMessageId
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      activeBranchFrom: undefined
    }));

    const agent = get().agents.find((item) => item.id === agentId);
    if (!agent || agent.status === "offline") {
      set((state) => ({
        messages: state.messages.map((message) =>
          message.id === userMessage.id ? { ...message, status: "queued" } : message
        )
      }));
      set((state) => ({
        agents: state.agents.map((item) =>
          item.id === agentId
            ? { ...item, queuedDrafts: (item.queuedDrafts ?? 0) + 1 }
            : item
        )
      }));
      return;
    }

    set((state) => ({
      typingByConversation: { ...state.typingByConversation, [conversationId]: true }
    }));

    const { realModeEnabled, realConnectionStatus, realPairingId } = get();
    const shouldUseReal = realModeEnabled && realConnectionStatus === "connected" && agent.type === "self";

    const response = shouldUseReal
      ? await simulateRealAgentResponse(content, agent, realPairingId)
      : await simulateAgentResponse(content, agent);

    const agentMessage: Message = {
      id: uid(),
      conversationId,
      agentId,
      role: "agent",
      content: response.summary,
      summary: response.summary,
      rawReasoning: response.raw_reasoning,
      plan: response.plan,
      commands: response.commands,
      logs: response.logs,
      status:
        response.final_status === "success"
          ? "done"
          : response.final_status === "failure"
          ? "failed"
          : "refused",
      createdAt: new Date().toISOString(),
      parentMessageId
    };

    set((state) => ({
      messages: [...state.messages, agentMessage],
      typingByConversation: { ...state.typingByConversation, [conversationId]: false },
      agents: state.agents.map((item) =>
        item.id === agentId ? { ...item, lastSummary: response.summary } : item
      )
    }));
  }
}));
