export type AgentType = "self" | "friend" | "friend_claw";

export type AgentStatus = "online" | "offline";

export type Agent = {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  api: string;
  lastSeen?: string;
  queuedDrafts?: number;
  lastSummary?: string;
  activeTasks: number;
};

export type Friend = {
  id: string;
  name: string;
  status: AgentStatus;
  agentId: string;
};

export type Conversation = {
  id: string;
  agentId: string;
  title: string;
  updatedAt?: string;
  summary?: string;
};

export type MessageRole = "user" | "agent";

export type Message = {
  id: string;
  conversationId: string;
  agentId: string;
  role: MessageRole;
  content: string;
  summary?: string;
  rawReasoning?: string;
  plan?: string[];
  commands?: string[];
  logs?: string[];
  status?: "planning" | "running" | "failed" | "done" | "refused" | "queued";
  parentMessageId?: string;
  createdAt: string;
};

export type Task = {
  id: string;
  agentId: string;
  name: string;
  status: "idle" | "running" | "failed" | "done";
  progress: number;
};

export type EventItem = {
  id: string;
  agentId: string;
  type: "Execution" | "Planning" | "Failure" | "Meta" | "System";
  description: string;
  time: string;
  logs?: string[];
};

export type CronJob = {
  id: string;
  agentId: string;
  name: string;
  cadence: string;
  nextRun: string;
  status: "scheduled" | "paused";
};

export type MemoryTier = "short_term" | "long_term";

export type MemoryEntry = {
  id: string;
  path: string;
  title: string;
  tier: MemoryTier;
  updatedAt: string;
  size: string;
  content: string;
};
