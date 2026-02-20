import { NextResponse } from "next/server";
import { getPairingSession } from "@/lib/server/pairingStore";
import { promptByAgentName, promptByType } from "@/lib/prompts";

type ChatRequest = {
  input: string;
  pairingId?: string;
  agentName: string;
  agentType: "self" | "friend" | "friend_claw";
  agentApi: string;
};

export async function POST(request: Request) {
  if (process.env.OPENCLAW_REAL_ENABLED !== "true") {
    return NextResponse.json({ error: "Real OpenClaw mode is disabled on server." }, { status: 403 });
  }

  const body = (await request.json()) as ChatRequest;
  if (!body.pairingId) {
    return NextResponse.json({ error: "Missing pairing session." }, { status: 400 });
  }

  const pairing = getPairingSession(body.pairingId);
  if (!pairing || pairing.status !== "connected") {
    return NextResponse.json({ error: "ClawPC is not connected yet." }, { status: 409 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY" }, { status: 500 });
  }

  const basePrompt =
    promptByAgentName[body.agentName] ?? promptByType[body.agentType] ?? "You are a helpful assistant.";

  const prompt = `${basePrompt}\nYou are connected through OpenClaw real relay mode.\nReturn strict JSON only with schema:\n{\n  \"response\": string,\n  \"raw_reasoning\": string,\n  \"plan\": string[],\n  \"commands\": string[],\n  \"logs\": string[],\n  \"final_status\": \"success\" | \"failure\"\n}\nRules:\n- No markdown and no code fences.\n- Keep response concise and practical.\nUser input: ${body.input}`;

  const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: mapModel(body.agentApi),
      max_tokens: 700,
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!anthropicResponse.ok) {
    const errorText = await anthropicResponse.text();
    return NextResponse.json({ error: errorText }, { status: anthropicResponse.status });
  }

  const raw = await anthropicResponse.json();
  const content = Array.isArray(raw?.content)
    ? raw.content.map((block: { text?: string }) => block.text ?? "").join("")
    : raw?.content?.[0]?.text ?? "";

  const parsed = parseStructuredResponse(content);
  return NextResponse.json(parsed);
}

function parseStructuredResponse(text: string) {
  const fallback = {
    summary: "Connected to OpenClaw real mode.",
    raw_reasoning: "Model did not return strict JSON; fallback used.",
    plan: [],
    commands: [],
    logs: [],
    final_status: "success" as const
  };

  try {
    const parsed = JSON.parse(text);
    return normalizeResponse(parsed, fallback);
  } catch {
    try {
      const parsed = JSON.parse(extractFirstJson(text));
      return normalizeResponse(parsed, fallback);
    } catch {
      return fallback;
    }
  }
}

function normalizeResponse(parsed: Record<string, unknown>, fallback: {
  summary: string;
  raw_reasoning: string;
  plan: string[];
  commands: string[];
  logs: string[];
  final_status: "success";
}) {
  const summary = typeof parsed.response === "string"
    ? parsed.response
    : typeof parsed.summary === "string"
    ? parsed.summary
    : fallback.summary;

  return {
    summary,
    raw_reasoning: typeof parsed.raw_reasoning === "string" ? parsed.raw_reasoning : fallback.raw_reasoning,
    plan: Array.isArray(parsed.plan) ? parsed.plan.filter((item): item is string => typeof item === "string") : fallback.plan,
    commands: Array.isArray(parsed.commands)
      ? parsed.commands.filter((item): item is string => typeof item === "string")
      : fallback.commands,
    logs: Array.isArray(parsed.logs) ? parsed.logs.filter((item): item is string => typeof item === "string") : fallback.logs,
    final_status: parsed.final_status === "failure" ? "failure" : "success"
  };
}

function extractFirstJson(text: string) {
  const start = text.indexOf("{");
  if (start === -1) return text;
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    const char = text[i];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return text.slice(start, i + 1);
  }
  return text.slice(start);
}

function mapModel(apiLabel: string) {
  if (apiLabel.toLowerCase().includes("opus")) return "claude-opus-4-20250514";
  if (apiLabel.toLowerCase().includes("sonnet")) return "claude-sonnet-4-20250514";
  return "claude-sonnet-4-20250514";
}
