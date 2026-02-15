import type { Agent, Conversation, CronJob, EventItem, Friend, MemoryEntry, Message, Task } from "./types";

export const initialAgents: Agent[] = [
  {
    id: "self-1",
    name: "Panda",
    type: "self",
    status: "online",
    api: "Anthropic Opus",
    lastSummary: "Refined build pipeline and de-risked deploys",
    activeTasks: 2
  },
  {
    id: "self-2",
    name: "Sloth",
    type: "self",
    status: "online",
    api: "Anthropic Sonnet",
    lastSummary: "Indexing runbooks and improving alert hygiene",
    activeTasks: 1
  },
  {
    id: "self-3",
    name: "Lynx",
    type: "self",
    status: "online",
    api: "OpenAI GPT-4o",
    lastSummary: "Tuning latency budgets across services",
    activeTasks: 3
  },
  {
    id: "friend-rahul",
    name: "Rahul",
    type: "friend",
    status: "online",
    api: "Anthropic Sonnet",
    lastSummary: "Heads-down on on-call ops cleanup",
    activeTasks: 1
  },
  {
    id: "friend-claw-rahul",
    name: "Rahul's OpenClaw",
    type: "friend_claw",
    status: "online",
    api: "Anthropic Sonnet",
    lastSummary: "Summarizing Rahul's workstream",
    activeTasks: 1
  },
  {
    id: "friend-shruti",
    name: "Shruti",
    type: "friend",
    status: "offline",
    api: "Ollama",
    lastSeen: "5h ago",
    queuedDrafts: 0,
    lastSummary: "Reviewing incident retrospectives",
    activeTasks: 0
  },
  {
    id: "friend-claw-shruti",
    name: "Shruti's OpenClaw",
    type: "friend_claw",
    status: "offline",
    api: "Ollama",
    lastSeen: "5h ago",
    queuedDrafts: 0,
    lastSummary: "Quiet mode",
    activeTasks: 0
  }
];

export const initialFriends: Friend[] = [
  {
    id: "friend-rahul",
    name: "Rahul",
    status: "online",
    agentId: "friend-claw-rahul"
  },
  {
    id: "friend-shruti",
    name: "Shruti",
    status: "offline",
    agentId: "friend-claw-shruti"
  }
];

export const initialConversations: Conversation[] = [
  {
    id: "conv-self",
    agentId: "self-1",
    title: "Release Command",
    updatedAt: "2026-02-15T09:30:00Z",
    summary: "Stability sweep + deployment prep"
  },
  {
    id: "conv-self-2",
    agentId: "self-1",
    title: "Incident Follow-up",
    updatedAt: "2026-02-14T18:12:00Z",
    summary: "Postmortem and owner handoff"
  },
  {
    id: "conv-self-3",
    agentId: "self-1",
    title: "Growth Experiments",
    updatedAt: "2026-02-13T11:05:00Z",
    summary: "Launch readiness and dashboards"
  },
  { id: "conv-rahul", agentId: "friend-rahul", title: "Rahul" },
  { id: "conv-rahul-claw", agentId: "friend-claw-rahul", title: "Rahul's Claw" },
  { id: "conv-shruti", agentId: "friend-shruti", title: "Shruti" },
  { id: "conv-shruti-claw", agentId: "friend-claw-shruti", title: "Shruti's Claw" }
];

export const initialMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-self",
    agentId: "self-1",
    role: "agent",
    content: "Pipeline stabilization complete. Three flaky tests isolated.",
    summary: "Pipeline stabilized",
    rawReasoning: "Synthesized CI logs and isolated recurring failures.",
    plan: ["Confirm cache keys", "Re-run full suite", "Schedule follow-up with owners"],
    commands: ["pnpm test --filter pipeline"],
    logs: ["[ok] cache warm", "[ok] unit tests", "[warn] flaky: api/worker"],
    status: "done",
    createdAt: "2026-02-15T09:04:00Z"
  },
  {
    id: "msg-2",
    conversationId: "conv-self-2",
    agentId: "self-1",
    role: "agent",
    content: "Postmortem draft ready with root cause and mitigation plan.",
    summary: "Postmortem ready",
    rawReasoning: "Summarized incident sequence and mapped mitigations.",
    plan: ["Share draft with owners", "Confirm timeline accuracy", "Schedule review"],
    commands: ["cat docs/postmortem.md"],
    logs: ["[ok] report assembled", "[ok] timeline verified"],
    status: "done",
    createdAt: "2026-02-14T18:12:00Z"
  },
  {
    id: "msg-3",
    conversationId: "conv-self-3",
    agentId: "self-1",
    role: "agent",
    content: "Experiment dashboard linked. Control group is stable.",
    summary: "Experiment dashboard ready",
    rawReasoning: "Compared key metrics across cohorts.",
    plan: ["Review conversion delta", "Confirm sample size", "Greenlight next test"],
    commands: ["open dashboards/experiment-12"],
    logs: ["[ok] dashboard refreshed", "[info] control stable"],
    status: "done",
    createdAt: "2026-02-13T11:05:00Z"
  }
];

export const initialTasks: Task[] = [
  { id: "task-1", agentId: "self-1", name: "Release readiness scan", status: "running", progress: 64 },
  { id: "task-2", agentId: "self-1", name: "Incident follow-up", status: "idle", progress: 18 }
];

export const initialEvents: EventItem[] = [
  {
    id: "evt-1",
    agentId: "self-1",
    type: "Execution",
    description: "Fixed Gradle build \u2713",
    time: "09:12",
    logs: [
      "[info] cache warm",
      "[info] dependencies resolved",
      "[ok] gradle build",
      "[ok] tests green",
      "[ok] artifact uploaded"
    ]
  },
  {
    id: "evt-2",
    agentId: "self-1",
    type: "Planning",
    description: "Designed hiring funnel",
    time: "08:41",
    logs: [
      "[note] aligned stages",
      "[note] defined scoring rubric",
      "[note] scheduled recruiter sync"
    ]
  },
  {
    id: "evt-3",
    agentId: "self-1",
    type: "Failure",
    description: "Test suite crashed",
    time: "Yesterday",
    logs: [
      "[error] timeout in api/worker",
      "[error] retries exhausted",
      "[warn] flaky test bucket flagged"
    ]
  },
  {
    id: "evt-4",
    agentId: "self-1",
    type: "Meta",
    description: "Pattern detected in deployments",
    time: "Yesterday",
    logs: [
      "[meta] 3 deploys with elevated latency",
      "[meta] correlation with cache misses"
    ]
  }
];

export const initialCrons: CronJob[] = [
  {
    id: "cron-1",
    agentId: "self-1",
    name: "Daily build health",
    cadence: "Every day • 07:30",
    nextRun: "Feb 16, 2026 • 07:30",
    status: "scheduled"
  },
  {
    id: "cron-2",
    agentId: "self-1",
    name: "Incident digest",
    cadence: "Weekdays • 18:00",
    nextRun: "Feb 16, 2026 • 18:00",
    status: "scheduled"
  },
  {
    id: "cron-3",
    agentId: "self-1",
    name: "Experiment sync",
    cadence: "Mon/Wed/Fri • 09:00",
    nextRun: "Feb 17, 2026 • 09:00",
    status: "scheduled"
  },
  {
    id: "cron-4",
    agentId: "self-1",
    name: "Runbook refresh",
    cadence: "Weekly • Sun 16:00",
    nextRun: "Feb 22, 2026 • 16:00",
    status: "scheduled"
  }
];

export const initialMemory: MemoryEntry[] = [
  {
    id: "mem-1",
    path: "MEMORY.md",
    title: "MEMORY.md",
    tier: "long_term",
    updatedAt: "2026-02-15 09:18",
    size: "18 KB",
      content:
      "# OpenClaw Memory Index\n\n## Core Protocol\nOpenClaw maintains a primary memory index for stable facts, plus dated memory captures for daily work.\n\n## Operating Beliefs\n- Favor precise, minimal updates.\n- Prefer reversible decisions.\n- Keep state short and structured.\n- When in doubt, ask for confirmation before irreversible steps.\n\n## Permanent Context\n- Primary operator: user-facing cockpit.\n- Safety boundary: no command execution on external environments without explicit permission.\n- All mock executions should remain client-only.\n\n## Preferences\n- Tone: calm, direct, and short.\n- UI: cream background, mint accents, rounded corners, terminal hints.\n- Avoid violet.\n\n## Recent Highlights\n- Production readiness scan shipped.\n- Experiment dashboard elevated to weekly cadence.\n- Incident follow-up workflow aligned.\n\n## Open Threads\n- Agent restart automation.\n- Task graph enrichment.\n- Memory file explorer polish.\n\n## Decision Log\n- 2026-02-13: Adopted multi-agent bottom sheet selector.\n- 2026-02-15: Introduced demo mode toggle in settings.\n"
  },
  {
    id: "mem-2",
    path: "SOUL.md",
    title: "SOUL.md",
    tier: "long_term",
    updatedAt: "2026-02-14 17:40",
    size: "11 KB",
    content:
      "# Soul\n\nMission: Reduce coordination load while amplifying judgment quality.\n\nTraits:\n- Calm under pressure.\n- Minimal surface area.\n- Persistent accountability.\n\nBehavioral Safeguards:\n- Never execute commands on external systems without consent.\n- Keep summaries to the point.\n- Prefer requesting confirmation for risky actions.\n"
  },
  {
    id: "mem-3",
    path: "USER.md",
    title: "USER.md",
    tier: "long_term",
    updatedAt: "2026-02-15 08:22",
    size: "9 KB",
    content:
      "# User Profile\n\nPreferences:\n- Minimal UI with soft cream and mint tones.\n- No violet.\n- Short updates, avoid verbosity.\n\nWorking Style:\n- Fast alignment, then deep work.\n- Wants multi-agent clarity.\n- Prefers explicit permission boundaries.\n"
  },
  {
    id: "mem-4",
    path: "ENVIRONMENT.md",
    title: "ENVIRONMENT.md",
    tier: "long_term",
    updatedAt: "2026-02-13 10:10",
    size: "7 KB",
    content:
      "# Environment\n\n- Client-only mock environment.\n- No backend services.\n- Local state only.\n- Primary workspace: buildindiaclaw.\n"
  },
  {
    id: "mem-5",
    path: "SCRATCHPAD.md",
    title: "SCRATCHPAD.md",
    tier: "short_term",
    updatedAt: "2026-02-15 09:05",
    size: "6 KB",
    content:
      "# Scratchpad\n\n- Add cron schedule preview to observatory.\n- Improve system tab with live-like metrics.\n- Expand memory file explorer.\n"
  },
  {
    id: "mem-6",
    path: "memory/2026-02-15.md",
    title: "2026-02-15.md",
    tier: "short_term",
    updatedAt: "2026-02-15 09:20",
    size: "14 KB",
      content:
      "# Daily Memory — 2026-02-15\n\n## Summary\n- Stabilized pipeline.\n- Refined deployment checklist.\n- Confirmed experiment readiness.\n- Added conversation history to demo chat.\n\n## Notes\n- Agent restart mock should include status transitions.\n- New cron schedule slots to show next 7 days.\n- Add friend flow should create both friend + claw channels.\n\n## Decisions\n- Use mint accents with cream base.\n- Keep command blocks monospace only.\n- Friend claw replies show only response line.\n\n## TODO\n- Layer in more realistic system metrics.\n- Expand memory files beyond four entries.\n"
  },
  {
    id: "mem-7",
    path: "memory/2026-02-14.md",
    title: "2026-02-14.md",
    tier: "short_term",
    updatedAt: "2026-02-14 18:05",
    size: "12 KB",
      content:
      "# Daily Memory — 2026-02-14\n\n## Summary\n- Drafted postmortem.\n- Compiled incident timeline.\n- Identified noisy alert sources.\n\n## Follow-ups\n- Confirm owner feedback.\n- Verify alert suppression windows.\n- Track long-term fixes across services.\n"
  },
  {
    id: "mem-8",
    path: "memory/2026-02-13.md",
    title: "2026-02-13.md",
    tier: "short_term",
    updatedAt: "2026-02-13 11:00",
    size: "10 KB",
    content:
      "# Daily Memory — 2026-02-13\n\n## Summary\n- Linked experiment dashboard.\n- Highlighted stability delta.\n\n## Notes\n- Keep conversation threads visible in demo mode.\n"
  }
];
