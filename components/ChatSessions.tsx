"use client";

import { useState } from "react";
import { Card } from "./Card";
import { ChatStream } from "./ChatStream";

const sessions = [
  { id: "sports-1", topic: "sports", last: "Who has better form today?" },
  { id: "teer-1", topic: "teer", last: "Summarize last 30 days." },
  { id: "astro-1", topic: "astrology", last: "Today vibes in Hinglish" }
];

export function ChatSessions() {
  const [active, setActive] = useState(sessions[0]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.6fr_1fr]">
      <Card title="All sessions">
        <div className="space-y-3">
          {sessions.map((session) => (
            <button
              key={session.id}
              className={`w-full rounded-xl border border-ink-100 p-4 text-left transition hover:border-ink-200 ${
                active.id === session.id ? "bg-ink-50" : "bg-white"
              }`}
              onClick={() => setActive(session)}
            >
              <p className="text-sm font-medium text-ink-900 capitalize">{session.topic}</p>
              <p className="text-xs text-ink-500">{session.last}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card title={`Chat: ${active.topic}`}>
        <ChatStream topic={active.topic} />
      </Card>
    </div>
  );
}
