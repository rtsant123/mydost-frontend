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
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sessions.map((session) => (
          <button
            key={session.id}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
              active.id === session.id
                ? "border-ink-900 bg-ink-900 text-white"
                : "border-ink-100 bg-white text-ink-600"
            }`}
            onClick={() => setActive(session)}
          >
            {session.topic}
          </button>
        ))}
      </div>

      <Card title={`Chat: ${active.topic}`}>
        <ChatStream topic={active.topic} />
      </Card>
    </div>
  );
}
