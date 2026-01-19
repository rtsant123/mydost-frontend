import { Card } from "@/components/Card";
import { TeerResults } from "@/components/TeerResults";
import { Button } from "@/components/Button";

export default function TeerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Teer</h1>
        <p className="text-sm text-ink-600">Follow houses and track the latest results.</p>
      </div>
      <TeerResults />

      <Card title="Ask mydost">
        <p className="text-sm text-ink-600">
          Ask about patterns, summaries, or explanations for recent results.
        </p>
        <Button href="/chat?topic=teer" className="mt-4">
          Open Teer chat
        </Button>
      </Card>
    </div>
  );
}
