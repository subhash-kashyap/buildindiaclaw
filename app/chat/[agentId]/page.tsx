"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import MessageBlock from "@/components/chat/MessageBlock";
import ChatComposer from "@/components/chat/ChatComposer";
import OfflineBanner from "@/components/chat/OfflineBanner";
import ConversationList from "@/components/chat/ConversationList";
import TypingIndicator from "@/components/chat/TypingIndicator";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const agents = useAppStore((state) => state.agents);
  const ensureConversation = useAppStore((state) => state.ensureConversation);
  const conversations = useAppStore((state) => state.conversations);
  const messages = useAppStore((state) => state.messages);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const activeBranchFrom = useAppStore((state) => state.activeBranchFrom);
  const setActiveBranchFrom = useAppStore((state) => state.setActiveBranchFrom);
  const demoMode = useAppStore((state) => state.demoMode);
  const typingByConversation = useAppStore((state) => state.typingByConversation);

  const agent = useMemo(() => agents.find((item) => item.id === agentId), [agents, agentId]);
  const [conversationId, setConversationId] = useState<string>("");
  const showAdvanced = agent?.type === "self";
  const agentLabel =
    agent?.type === "self"
      ? agent?.name ?? "Panda"
      : agent?.type === "friend"
      ? agent?.name ?? "Friend"
      : agent?.name ?? "Claw";

  const availableConversations = useMemo(
    () => conversations.filter((item) => item.agentId === agentId),
    [conversations, agentId]
  );

  useEffect(() => {
    if (availableConversations.length) {
      if (!availableConversations.find((item) => item.id === conversationId)) {
        setConversationId(availableConversations[0].id);
      }
      return;
    }
    setConversationId(ensureConversation(agentId));
  }, [agentId, availableConversations, conversationId, ensureConversation]);

  const conversationMessages = useMemo(
    () => messages.filter((message) => message.conversationId === conversationId),
    [messages, conversationId]
  );

  const handleSend = async (content: string) => {
    if (!conversationId) return;
    await sendMessage({
      agentId,
      conversationId,
      content,
      parentMessageId: activeBranchFrom
    });
  };

  return (
    <main className="px-6 pb-40 pt-24">
      <div className="fixed left-1/2 top-4 z-40 w-[92%] max-w-md -translate-x-1/2 rounded-3xl bg-cream-50 p-4 shadow-card backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-200 text-ink-700"
              aria-label="Back"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-ink-500">Chat</div>
              <div className="mt-1 font-display text-base font-semibold text-ink-900">{agent?.name ?? "Panda"}</div>
              <div className="text-xs text-ink-600">
                {agent?.type === "friend" ? "Friend" : agent?.type === "friend_claw" ? "Claw" : "Primary"}
              </div>
            </div>
          </div>
          <span className={`h-2.5 w-2.5 rounded-full ${agent?.status === "online" ? "bg-mint-500" : "bg-rose-400"}`} />
        </div>
      </div>

      <div className="mx-auto max-w-md animate-fade-up">

        {agent?.status === "offline" ? (
          <div className="mt-4">
            <OfflineBanner />
          </div>
        ) : null}

        {agent?.type === "self" && demoMode ? (
          <ConversationList
            conversations={availableConversations}
            activeId={conversationId}
            onSelect={setConversationId}
          />
        ) : null}

        <div className="mt-6 grid gap-4">
          {conversationMessages.map((message) => (
            <MessageBlock
              key={message.id}
              message={message}
              onBranch={() => setActiveBranchFrom(message.id)}
              showAdvanced={showAdvanced}
              agentLabel={agentLabel}
            />
          ))}
          {typingByConversation[conversationId] ? <TypingIndicator label={agentLabel} /> : null}
        </div>
      </div>

      <ChatComposer
        disabled={agent?.status === "offline"}
        onSend={handleSend}
        branchFrom={activeBranchFrom}
      />
    </main>
  );
}
