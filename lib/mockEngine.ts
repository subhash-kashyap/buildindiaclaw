import type { Agent } from "./types";
import { promptByAgentName, promptByType } from "./prompts";

export type AgentResponse = {
  summary: string;
  raw_reasoning: string;
  plan: string[];
  commands: string[];
  logs: string[];
  final_status: "success" | "failure" | "refused";
};

const commandIntent = /(run|execute|install|deploy|delete|remove|rm|npm|yarn|pnpm|pip|bash|sudo|git)/i;

const fallbackResponse: AgentResponse = {
  summary: "Acknowledged. Ready for your next instruction.",
  raw_reasoning: "Fallback response generated due to missing key or parse failure.",
  plan: ["Clarify intent", "Propose next step", "Wait for confirmation"],
  commands: [],
  logs: [],
  final_status: "success"
};

const friendSummary: AgentResponse = {
  summary: "Rahul has been iterating on the on-call dashboard and tightening incident runbooks.",
  raw_reasoning: "Shared only high-level progress without sensitive details.",
  plan: ["Share high-level tasks", "Highlight blockers", "Offer to sync"],
  commands: [],
  logs: ["[note] No confidential or operational data exposed."],
  final_status: "success"
};

const refusal: AgentResponse = {
  summary: "Permission denied",
  raw_reasoning: "This request crosses a permission boundary. I cannot execute commands in Rahul's environment without explicit access.",
  plan: [],
  commands: [],
  logs: [],
  final_status: "refused"
};

export async function simulateAgentResponse(input: string, agent: Agent): Promise<AgentResponse> {
  if (agent.type === "friend_claw") {
    if (commandIntent.test(input)) {
      return refusal;
    }
  }

  const basePrompt =
    promptByAgentName[agent.name] ?? promptByType[agent.type] ?? "You are a helpful assistant.";

  const model = mapModel(agent.api);

  const prompt = `${basePrompt}\nReturn strict JSON only with the schema:\n{\n  \"response\": string,\n  \"raw_reasoning\": string,\n  \"plan\": string[],\n  \"commands\": string[],\n  \"logs\": string[],\n  \"final_status\": \"success\" | \"failure\"\n}\nRules:\n- Output JSON only. No markdown, no code fences, no extra text.\n- The response should be short and direct.\n- Put optional detail in raw_reasoning/plan/commands/logs.\n- Keep commands and logs empty unless explicitly asked.\nUser input: ${input}`;

  const requestBody = {
    model,
    max_tokens: 600,
    temperature: 0.4,
    messages: [{ role: "user", content: prompt }]
  };

  const attemptFetch = async () => {
    const response = await fetch("/api/anthropic", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic request failed", response.status, errorText);
      if (errorText.includes("Missing ANTHROPIC_API_KEY")) {
        return {
          ...fallbackResponse,
          summary: "API key missing. Add ANTHROPIC_API_KEY to .env and restart."
        };
      }
      throw new Error("Anthropic request failed");
    }

    const data = await response.json();
    const content = Array.isArray(data?.content)
      ? data.content.map((block: { text?: string }) => block.text ?? "").join("")
      : data?.content?.[0]?.text ?? "";
    return parseAgentResponse(content, true);
  };

  try {
    return await attemptFetch();
  } catch (error) {
    console.error("Anthropic request error", error);
    try {
      return await attemptFetch();
    } catch (finalError) {
      console.error("Anthropic retry failed", finalError);
      return fallbackResponse;
    }
  }
}

function parseAgentResponse(text: string, strict?: boolean): AgentResponse {
  try {
    const parsed = JSON.parse(text);
    const summary = parsed.response ?? parsed.summary;
    if (!parsed || typeof summary !== "string") {
      if (strict) throw new Error("Invalid JSON payload");
      return fallbackResponse;
    }
    return {
      summary,
      raw_reasoning: parsed.raw_reasoning ?? fallbackResponse.raw_reasoning,
      plan: Array.isArray(parsed.plan) ? parsed.plan : fallbackResponse.plan,
      commands: Array.isArray(parsed.commands) ? parsed.commands : fallbackResponse.commands,
      logs: Array.isArray(parsed.logs) ? parsed.logs : fallbackResponse.logs,
      final_status: parsed.final_status === "failure" ? "failure" : "success"
    };
  } catch {
    try {
      const extracted = extractFirstJson(text);
      const parsed = JSON.parse(extracted);
      const summary = parsed.response ?? parsed.summary;
      if (!parsed || typeof summary !== "string") {
        if (strict) throw new Error("Invalid JSON payload");
        return fallbackResponse;
      }
      return {
        summary,
        raw_reasoning: parsed.raw_reasoning ?? fallbackResponse.raw_reasoning,
        plan: Array.isArray(parsed.plan) ? parsed.plan : fallbackResponse.plan,
        commands: Array.isArray(parsed.commands) ? parsed.commands : fallbackResponse.commands,
        logs: Array.isArray(parsed.logs) ? parsed.logs : fallbackResponse.logs,
        final_status: parsed.final_status === "failure" ? "failure" : "success"
      };
    } catch {
      if (strict) throw new Error("Invalid JSON payload");
      return fallbackResponse;
    }
  }
}

function extractFirstJson(text: string) {
  const start = text.indexOf("{");
  if (start === -1) return text;
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    const char = text[i];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }
  return text.slice(start);
}

function mapModel(apiLabel: string) {
  if (apiLabel.toLowerCase().includes("opus")) return "claude-opus-4-20250514";
  if (apiLabel.toLowerCase().includes("sonnet")) return "claude-sonnet-4-20250514";
  return "claude-sonnet-4-20250514";
}
