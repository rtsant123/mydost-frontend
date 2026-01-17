import { Card } from "@/components/Card";
import { ChatStream } from "@/components/ChatStream";

const quickChips = ["today vibes", "career", "love", "study", "health"];

export default function AstrologyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Astrology</h1>
        <p className="text-sm text-ink-600">Chat in your preferred language.</p>
      </div>
      <Card title="Astrology chat">
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip) => (
            <span key={chip} className="badge">
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <ChatStream topic="astrology" />
        </div>
        <p className="disclaimer mt-4">Entertainment only.</p>
      </Card>
    </div>
  );
}
