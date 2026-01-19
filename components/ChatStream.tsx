"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import { CardResponse, ChatMessage } from "@/lib/types";
import { Button } from "./Button";
import { GoogleLoginButton } from "./GoogleLoginButton";

const createUserMessage = (text: string): ChatMessage => ({
  id: `user-${Date.now()}`,
  role: "user",
  text
});

const messageToText = (message: ChatMessage) => {
  if (message.role === "user") return message.text?.trim() ?? "";
  const parts: string[] = [];
  for (const card of message.cards ?? []) {
    if (card.title) parts.push(card.title);
    if (card.content) parts.push(card.content);
    if (card.bullets?.length) parts.push(card.bullets.join(" "));
  }
  return parts.join(" ").trim();
};

const buildRecentContext = (messages: ChatMessage[], maxMessages = 6, maxChars = 1200) => {
  const recent = messages.slice(-maxMessages);
  const lines = recent
    .map((msg) => {
      const text = messageToText(msg);
      if (!text) return null;
      return `${msg.role === "user" ? "User" : "Assistant"}: ${text}`;
    })
    .filter(Boolean) as string[];
  let joined = lines.join("\n");
  if (joined.length > maxChars) {
    joined = joined.slice(-maxChars);
  }
  return joined;
};

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
    return `${API_BASE_URL}/chat/stream?${params.toString()}`;
  }, [topic, matchId]);

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

    const trimmedInput = input.trim();
    const recentContext = buildRecentContext(messages);
    const combinedContext = [contextPrefix, recentContext].filter(Boolean).join("\n\n");
    const params = new URLSearchParams({
      topic,
      q: trimmedInput
    });
    if (matchId) params.set("matchId", matchId);
    if (combinedContext) params.set("context", combinedContext);
    const eventSource = new EventSource(`${API_BASE_URL}/chat/stream?${params.toString()}`);
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
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white shadow-card">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ink-200">You</p>
                  <p className="mt-1">{message.text}</p>
                </div>
              </div>
            )}
            {message.role === "assistant" && message.cards?.length ? (
              <div className="flex justify-start">
                <div className="max-w-[85%] space-y-4 rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-700 shadow-card">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400">Dost</p>
                  {message.cards.map((card, index) => {
                    const isExpanded = expandedCards[card.id];
                    const content =
                      isExpanded || !card.content ? card.content : `${card.content.slice(0, 140)}...`;
                    const bullets =
                      isExpanded || !card.bullets ? card.bullets : card.bullets.slice(0, 2);
                    const isExpandable =
                      (card.content && card.content.length > 140) ||
                      (card.bullets && card.bullets.length > 2);
                    const showTitle =
                      Boolean(card.title) &&
                      (message.cards.length > 1 || card.title?.toLowerCase() !== "response");

                    return (
                      <div key={card.id ?? `${message.id}-${index}`} className="space-y-2">
                        {showTitle && (
                          <p className="text-sm font-semibold text-ink-900">{card.title}</p>
                        )}
                        {content && <p>{content}</p>}
                        {bullets && (
                          <ul className="list-disc space-y-1 pl-5">
                            {bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        )}
                        {card.table && (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-xs text-ink-600">
                              <thead className="text-[10px] uppercase text-ink-400">
                                <tr>
                                  {card.table.headers.map((header) => (
                                    <th key={header} className="px-2 py-1">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {card.table.rows.map((row, rowIndex) => (
                                  <tr
                                    key={`${row[0] ?? "row"}-${rowIndex}`}
                                    className="border-t border-ink-100"
                                  >
                                    {row.map((cell) => (
                                      <td key={cell} className="px-2 py-1">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {card.cta && (
                          <div className="flex flex-wrap gap-2">
                            {card.cta.map((item) => (
                              <Button key={item.label} href={item.href} variant="secondary" size="sm">
                                {item.label}
                              </Button>
                            ))}
                          </div>
                        )}
                        {isExpandable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => toggleExpand(card.id)}
                          >
                            {isExpanded ? "Collapse" : "Expand"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[60%] rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-500 shadow-card">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400">Dost</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-ink-300" />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-ink-300"
                  style={{ animationDelay: "120ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-ink-300"
                  style={{ animationDelay: "240ms" }}
                />
              </div>
            </div>
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
