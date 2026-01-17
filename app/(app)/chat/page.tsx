import { ChatSessions } from "@/components/ChatSessions";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Chats</h1>
        <p className="text-sm text-ink-600">Revisit past sessions or start a new one.</p>
      </div>
      <ChatSessions />
    </div>
  );
}
