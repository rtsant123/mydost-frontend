"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import { CardResponse, ChatMessage } from "@/lib/types";
import { Button } from "./Button";
import { CardRenderer } from "./CardRenderer";
import { GoogleLoginButton } from "./GoogleLoginButton";

const createUserMessage = (text: string): ChatMessage => ({
  id: `user-${Date.now()}`,
  role: "user",
  text
});

const normalizeCards = (payload: unknown): CardResponse[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) {
    return payload as CardResponse[];
  }
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.cards)) {
      return record.cards as CardResponse[];
    }
    if (record.card) {
      return normalizeCards(record.card);
    }
    if (typeof record.type === "string") {
      return [record as CardResponse];
    }
  }
  return [];
};

export function ChatStream({
  topic,
  matchId,
  contextPrefix,
  placeholder
}: {
  topic: string;
  matchId?: string;
  contextPrefix?: string;
  placeholder?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [token, setToken] = useState<string | null>(null);
  const hasGoogleClientId = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  const eventSourceRef = useRef<EventSource | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasResponseRef = useRef(false);

  const streamUrl = useMemo(() => {
    const params = new URLSearchParams({ topic });
    if (matchId) params.set("matchId", matchId);
    if (contextPrefix) params.set("context", contextPrefix);
    return `${API_BASE_URL}/chat/stream?${params.toString()}`;
  }, [topic, matchId, contextPrefix]);

  useEffect(() => {
    const auth = getAuth();
    setToken(auth.token);
    return () => {
      eventSourceRef.current?.close();
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      setLoading(false);
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, createUserMessage(input.trim())]);
    setInput("");
    setLoading(true);
    hasResponseRef.current = false;
    eventSourceRef.current?.close();
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }

    const eventSource = new EventSource(`${streamUrl}&q=${encodeURIComponent(input.trim())}`);
    eventSourceRef.current = eventSource;

    fallbackTimerRef.current = setTimeout(() => {
      if (!hasResponseRef.current) {
        eventSource.close();
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `fallback-${Date.now()}`,
            role: "assistant",
            cards: [
              {
                id: `fallback-card-${Date.now()}`,
                type: "warning",
                title: "No response yet",
                content:
                  "We could not reach the chat stream. Check NEXT_PUBLIC_API_BASE_URL or try again."
              }
            ]
          }
        ]);
      }
    }, 4000);

    eventSource.onmessage = (event) => {
      hasResponseRef.current = true;
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      let data: Record<string, unknown> | null = null;
      try {
        data = JSON.parse(event.data) as Record<string, unknown>;
      } catch {
        data = {
          card: {
            id: `raw-${Date.now()}`,
            type: "answer",
            title: "Reply",
            content: event.data
          }
        };
      }
      if (data?.done) {
        setLoading(false);
        eventSource.close();
        return;
      }
      const cards = normalizeCards(data).map((card, index) => ({
        ...card,
        id: card.id ?? `card-${Date.now()}-${index}`
      }));
      if (cards.length) {
        setMessages((prev) => {
          const existing = prev.find((message) => message.id === "assistant");
          if (existing) {
            const updated = prev.map((message) =>
              message.id === "assistant"
                ? {
                    ...message,
                    cards: [...(message.cards ?? []), ...cards]
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
              cards: cards
            }
          ];
        });
      }
    };

    eventSource.onerror = () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
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
    <div className="space-y-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-3">
            {message.role === "user" && (
              <div className="self-end rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white">
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
      <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={3}
          placeholder={placeholder ?? "Ask mydost anything..."}
          className="w-full resize-none rounded-xl border border-ink-100 p-3 text-sm outline-none focus:border-ink-300"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-400">Responses stream live. Entertainment only.</p>
          <Button onClick={handleSend} size="sm">
            Send
          </Button>
        </div>
        {!token && hasGoogleClientId && (
          <div className="mx-auto mt-3 w-full max-w-2xl rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-600">
            <p className="font-medium text-ink-900">Sign in to save memory.</p>
            <p className="mt-1 text-xs text-ink-500">You can chat without signing in.</p>
            <div className="mt-3">
              <GoogleLoginButton onSuccess={() => setToken(getAuth().token)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
