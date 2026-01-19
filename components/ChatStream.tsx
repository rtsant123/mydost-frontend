"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { CardResponse, ChatMessage } from "@/lib/types";
import { Button } from "./Button";
import { CardRenderer } from "./CardRenderer";

const createUserMessage = (text: string): ChatMessage => ({
  id: `user-${Date.now()}`,
  role: "user",
  text
});

export function ChatStream({ topic, matchId }: { topic: string; matchId?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const eventSourceRef = useRef<EventSource | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const canSend = input.trim().length > 0 && !loading;

  const streamUrl = useMemo(() => {
    const params = new URLSearchParams({ topic });
    if (matchId) params.set("matchId", matchId);
    return `${API_BASE_URL}/chat/stream?${params.toString()}`;
  }, [topic, matchId]);

  const suggestedPrompts = useMemo(() => {
    switch (topic) {
      case "sports":
      case "match":
        return ["Key momentum right now", "Who looks stronger?", "What should I watch next?"];
      case "teer":
        return ["Summarize last 30 days", "Any recent patterns?", "Top 3 historical trends"];
      case "astrology":
        return ["Today vibes", "Career focus this week", "Love outlook"];
      default:
        return ["Give me a quick summary", "What is trending today?", "Explain in simple terms"];
    }
  }, [topic]);

  const closeStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      closeStream();
    };
  }, [closeStream]);

  useEffect(() => {
    setMessages([]);
    setExpandedCards({});
    setLoading(false);
    closeStream();
  }, [topic, matchId, closeStream]);

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const handleSend = () => {
    if (loading) return;
    const prompt = input.trim();
    if (!prompt) return;
    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [...prev, createUserMessage(prompt)]);
    setInput("");
    setLoading(true);

    const eventSource = new EventSource(`${streamUrl}&q=${encodeURIComponent(prompt)}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as { card?: CardResponse; done?: boolean };
      const card = data.card;
      if (card) {
        setMessages((prev) => {
          const existing = prev.find((message) => message.id === assistantId);
          if (existing) {
            const updated = prev.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    cards: [...(message.cards ?? []), card]
                  }
                : message
            );
            return updated;
          }
          return [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              cards: [card]
            }
          ];
        });
      }
      if (data.done) {
        setLoading(false);
        closeStream();
      }
    };

    eventSource.onerror = () => {
      setLoading(false);
      closeStream();
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          cards: [
            {
              id: `warning-${Date.now()}`,
              type: "warning",
              title: "Streaming unavailable",
              content: "We could not reach the live stream. Please try again in a moment."
            }
          ]
        }
      ]);
    };
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1 sm:max-h-[60vh] lg:max-h-[65vh]">
        {messages.length === 0 && !loading && (
          <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
            <p className="text-sm font-medium text-ink-900">Start the conversation</p>
            <p className="mt-1 text-xs text-ink-500">
              Try one of these prompts or type your own question.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600 transition hover:border-ink-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-3">
            {message.role === "user" && (
              <div className="self-end rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white w-fit max-w-[85%] whitespace-pre-wrap break-words">
                {message.text}
              </div>
            )}
            {message.role === "assistant" &&
              message.cards?.map((card) => (
                <div key={card.id} className="space-y-2">
                  <CardRenderer
                    card={{
                      ...card,
                      content:
                        expandedCards[card.id] || !card.content
                          ? card.content
                          : `${card.content.slice(0, 140)}...`,
                      bullets:
                        expandedCards[card.id] || !card.bullets
                          ? card.bullets
                          : card.bullets.slice(0, 2)
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => toggleExpand(card.id)}
                  >
                    {expandedCards[card.id] ? "Collapse" : "Expand"}
                  </Button>
                </div>
              ))}
          </div>
        ))}
        {loading && (
          <div className="self-start rounded-2xl border border-ink-100 bg-white px-4 py-2 text-xs text-ink-500 shadow-card w-fit">
            mydost is typing…
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          rows={3}
          placeholder="Ask mydost anything..."
          className="w-full resize-none rounded-xl border border-ink-100 p-3 text-sm outline-none focus:border-ink-300 min-h-[96px]"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-400">Responses stream live. Entertainment only.</p>
          <Button onClick={handleSend} size="sm" className="w-full sm:w-auto" disabled={!canSend}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
