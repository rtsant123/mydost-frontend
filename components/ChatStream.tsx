"use client";

import { useEffect, useMemo, useState } from "react";
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

  const normalizeCards = (payload?: CardResponse | { cards?: CardResponse[] }): CardResponse[] => {
    if (!payload) return [];
    if ("cards" in payload && Array.isArray(payload.cards)) {
      return payload.cards;
    }
    return [payload as CardResponse];
  };

  const withIds = (cards: CardResponse[]) =>
    cards.map((card, index) => ({
      ...card,
      id: card.id ?? `card-${Date.now()}-${index}`
    }));

  const streamUrl = useMemo(() => {
    const params = new URLSearchParams({ topic });
    if (matchId) params.set("matchId", matchId);
    return `${API_BASE_URL}/chat/stream?${params.toString()}`;
  }, [topic, matchId]);

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, createUserMessage(input.trim())]);
    setInput("");
    setLoading(true);

    const eventSource = new EventSource(`${streamUrl}&q=${encodeURIComponent(input.trim())}`);
    let completed = false;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data) as { card?: CardResponse | { cards?: CardResponse[] }; done?: boolean };
      const incomingCards = withIds(normalizeCards(data.card));
      if (incomingCards.length) {
        setMessages((prev) => {
          const existing = prev.find((message) => message.id === "assistant");
          if (existing) {
            const updated = prev.map((message) =>
              message.id === "assistant"
                ? {
                    ...message,
                    cards: [...(message.cards ?? []), ...incomingCards]
                  }
                : message
            );
            return updated;
          }
          return [
            ...prev,
            {
              id: "assistant",
              role: "assistant",
              cards: incomingCards
            }
          ];
        });
      }
      if (data.done) {
        setLoading(false);
        completed = true;
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      if (completed) {
        eventSource.close();
        return;
      }
      setLoading(false);
      eventSource.close();
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-card">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {message.role === "user" && (
                <div className="ml-auto max-w-[75%] rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white">
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
            <div className="card card-section">
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          )}
        </div>
      </div>
      <div className="sticky bottom-4 flex flex-col gap-3 rounded-3xl border border-ink-100 bg-white/95 p-4 shadow-card backdrop-blur">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={3}
          placeholder="Ask mydost anything..."
          className="w-full resize-none rounded-2xl border border-ink-100 p-3 text-sm outline-none focus:border-ink-300"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-400">Responses stream live. Entertainment only.</p>
          <Button onClick={handleSend} size="sm">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
