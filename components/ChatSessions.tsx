"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatStream } from "./ChatStream";

const sessions = [
  { id: "dost-1", topic: "dost", label: "Dost" },
  { id: "sports-1", topic: "sports", label: "Sports" },
  { id: "teer-1", topic: "teer", label: "Teer" },
  { id: "astro-1", topic: "astrology", label: "Astrology" }
];

export function ChatSessions() {
  const params = useSearchParams();
  const [active, setActive] = useState(sessions[0]);

  useEffect(() => {
    const topic = params.get("topic");
    if (!topic) return;
    const found = sessions.find((session) => session.topic === topic);
    if (found) {
      setActive(found);
    }
  }, [params]);

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
            {session.label}
          </button>
        ))}
      </div>

      <ChatStream topic={active.topic} />
    </div>
  );
}
