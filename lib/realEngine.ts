import type { Agent } from "./types";
import type { AgentResponse } from "./mockEngine";

export async function simulateRealAgentResponse(
  input: string,
  agent: Agent,
  pairingId?: string
): Promise<AgentResponse> {
  if (!pairingId) {
    return {
      summary: "OpenClaw-real is enabled, but ClawPC is not paired yet.",
      raw_reasoning: "Pairing session missing.",
      plan: [],
      commands: [],
      logs: [],
      final_status: "failure"
    };
  }

  const response = await fetch("/api/openclaw-real/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      input,
      pairingId,
      agentName: agent.name,
      agentType: agent.type,
      agentApi: agent.api
    })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("openclaw-real request failed", response.status, text);
    return {
      summary: "Unable to reach OpenClaw-real. Check pairing and server config.",
      raw_reasoning: text,
      plan: [],
      commands: [],
      logs: [],
      final_status: "failure"
    };
  }

  const data = await response.json();
  return {
    summary: data.summary,
    raw_reasoning: data.raw_reasoning,
    plan: data.plan ?? [],
    commands: data.commands ?? [],
    logs: data.logs ?? [],
    final_status: data.final_status === "failure" ? "failure" : "success"
  };
}
