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
  const [token, setToken] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

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

  const getMemoryKey = (scope: "global" | "topic") =>
    scope === "global" ? "mydost_memory_global" : `mydost_memory_${topic}`;

  const loadMemory = (key: string) => {
    if (typeof window === "undefined") return [] as string[];
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  };

  const saveMemory = (key: string, entries: string[]) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(entries.slice(-10)));
  };

  const appendMemory = (entries: string[]) => {
    const globalKey = getMemoryKey("global");
    const topicKey = getMemoryKey("topic");
    saveMemory(globalKey, [...loadMemory(globalKey), ...entries]);
    saveMemory(topicKey, [...loadMemory(topicKey), ...entries]);
  };

  const buildMemoryPrefix = () => {
    const global = loadMemory(getMemoryKey("global")).slice(-4);
    const domain = loadMemory(getMemoryKey("topic")).slice(-4);
    const combined = [...global, ...domain].slice(-6);
    if (!combined.length) return "";
    return `Memory:\n${combined.map((line) => `- ${line}`).join("\n")}`;
  };

  const toCardResponses = (payload: any): CardResponse[] => {
    if (!payload) return [];
    const cards = Array.isArray(payload.cards) ? payload.cards : normalizeCards(payload as any);
    return cards.map((card: any, index: number) => ({
      id: card.id ?? `card-${Date.now()}-${index}`,
      type: card.type ?? "answer",
      title: card.title ?? "Response",
      confidence: card.confidence,
      bullets: card.bullets,
      content: card.content,
      table: card.table
        ? {
            headers: card.table.columns ?? card.table.headers ?? [],
            rows: card.table.rows ?? []
          }
        : undefined,
      cta: card.cta?.map((item: any) => ({
        label: item.label ?? "Open",
        href: typeof item.payload === "string" ? item.payload : item.payload?.href
      }))
    }));
  };

  const extractCleanText = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed.startsWith("{")) return trimmed;
    try {
      const parsed = JSON.parse(trimmed) as {
        content?: string;
        value?: string;
        text?: string;
        title?: string;
      };
      return parsed.content ?? parsed.value ?? parsed.text ?? parsed.title ?? trimmed;
    } catch (error) {
      return trimmed;
    }
  };

  useEffect(() => {
    const auth = getAuth();
    setToken(auth.token);
    return () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    setMessages([]);
    setInput("");
    setLoading(false);
  }, [topic]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    const trimmed = input.trim();
    const assistantId = `assistant-${Date.now()}`;
    setMessages((prev) => [...prev, createUserMessage(trimmed)]);
    setInput("");
    setLoading(true);

    const memoryPrefix = buildMemoryPrefix();
    const combinedPrefix = [contextPrefix, memoryPrefix].filter(Boolean).join("\n\n");
    const message = combinedPrefix ? `${combinedPrefix}\n\nUser: ${trimmed}` : trimmed;

    const shouldUsePublicStream = !token || topic === "dost";

    if (shouldUsePublicStream) {
      const eventSource = new EventSource(`${streamUrl}&q=${encodeURIComponent(message)}`);
      let completed = false;
      let lastCards: CardResponse[] = [];

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data) as { card?: CardResponse | { cards?: CardResponse[] }; done?: boolean };
        const incomingCards = withIds(normalizeCards(data.card));
        if (incomingCards.length) {
          lastCards = incomingCards;
          setMessages((prev) => {
            const existing = prev.find((message) => message.id === assistantId);
            if (existing) {
              const updated = prev.map((message) =>
                message.id === assistantId
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
                id: assistantId,
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
          appendMemory([
            `User: ${trimmed}`,
            `Assistant: ${lastCards
              .flatMap((card) => card.bullets ?? [])
              .slice(0, 2)
              .join(" ")}`
          ]);
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

      return;
    }
    const startChat = async () => {
      const sessionKey = `mydost_session_${topic}`;
      let sessionId = typeof window !== "undefined" ? window.localStorage.getItem(sessionKey) : null;
      if (!sessionId) {
        const startResponse = await fetch(`${API_BASE_URL}/chat/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ topic, refId: matchId })
        });
        if (!startResponse.ok) {
          throw new Error("Could not start chat");
        }
        const session = (await startResponse.json()) as { id: string };
        sessionId = session.id;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(sessionKey, sessionId);
        }
      }

      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId, message })
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let lastCards: CardResponse[] = [];
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const raw = line.replace("data:", "").trim();
          if (!raw) continue;
          const payload = JSON.parse(raw);
          const incomingCards = withIds(toCardResponses(payload));
          if (incomingCards.length) {
            lastCards = incomingCards;
            setMessages((prev) => {
              const existing = prev.find((message) => message.id === assistantId);
              if (existing) {
                const updated = prev.map((message) =>
                  message.id === assistantId
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
                  id: assistantId,
                  role: "assistant",
                  cards: incomingCards
                }
              ];
            });
            appendMemory([
              `User: ${trimmed}`,
              `Assistant: ${lastCards
                .flatMap((card) => card.bullets ?? [])
                .slice(0, 2)
                .join(" ")}`
            ]);
          }
        }
      }
      setLoading(false);
    };

    startChat().catch(() => {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          cards: [
            {
              id: `warning-${Date.now()}`,
              type: "warning",
              title: "Chat unavailable",
              content: "We could not reach the assistant. Please try again."
            }
          ]
        }
      ]);
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-28">
      <div className="rounded-3xl bg-ink-100/70 p-4 sm:p-6">
        <div className="space-y-4">
          {messages.map((message) => {
            if (message.role === "user") {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white shadow-sm">
                    {message.text}
                  </div>
                </div>
              );
            }

            const cards = message.cards ?? [];
            const plainText = cards
              .flatMap((card) => [card.content, ...(card.bullets ?? [])])
              .filter(Boolean)
              .map((part) => extractCleanText(String(part)))
              .join("\n\n");

            const tables = cards.filter((card) => card.table);

            return (
              <div key={message.id} className="space-y-3">
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-800 shadow-sm">
                    {plainText ? (
                      <div className="whitespace-pre-line text-sm text-ink-700">{plainText}</div>
                    ) : (
                      <p className="text-sm text-ink-600">No response available.</p>
                    )}
                  </div>
                </div>
                {tables.map((card, index) => (
                  <div
                    key={`${message.id}-table-${index}`}
                    className="max-w-[92%] rounded-2xl border border-ink-100 bg-white px-4 py-3 text-sm text-ink-800 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-ink-900">{card.title}</p>
                    <div className="mt-2 overflow-x-auto">
                      <table className="min-w-full text-left text-xs text-ink-600">
                        <thead className="text-[10px] uppercase text-ink-400">
                          <tr>
                            {card.table?.headers.map((header) => (
                              <th key={header} className="px-2 py-2">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {card.table?.rows.map((row, rowIndex) => (
                            <tr key={`${row[0]}-${rowIndex}`} className="border-t border-ink-100">
                              {row.map((cell) => (
                                <td key={cell} className="px-2 py-2">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          {loading && (
            <div className="card card-section">
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          )}
          {messages.length === 0 && !loading && (
            <p className="text-center text-xs text-ink-400">
              Ask a question to start the chat.
            </p>
          )}
          <div ref={endRef} />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-100 bg-white/95 px-4 pb-4 pt-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-end gap-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={2}
            placeholder={placeholder ?? "Type your message…"}
            className="min-h-[52px] flex-1 resize-none rounded-2xl border border-ink-100 bg-white p-3 text-sm outline-none focus:border-ink-300"
            disabled={false}
            spellCheck
            autoCorrect="on"
            autoCapitalize="sentences"
          />
          <Button onClick={handleSend} size="sm" className="h-11 px-4">
            Send
          </Button>
        </div>
        {!token && (
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
