import { DostChat } from "@/components/DostChat";

export default function DostPage() {
  return (
    <main className="container-page space-y-6 py-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-400">Dost</p>
        <h1 className="text-2xl font-semibold text-ink-900">Chat</h1>
        <p className="text-sm text-ink-600">One focused chat with your assistant.</p>
      </div>
      <DostChat />
      <noscript>
        <p className="text-xs text-ink-500">JavaScript is required for chat.</p>
      </noscript>
    </main>
  );
}
