import { Suspense } from "react";
import { ChatSessions } from "@/components/ChatSessions";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Chat with mydost</h1>
        <p className="text-sm text-ink-600">Pick a domain and start a fresh conversation.</p>
      </div>
      <Suspense fallback={<div className="text-sm text-ink-500">Loading chat…</div>}>
        <ChatSessions />
      </Suspense>
    </div>
  );
}
