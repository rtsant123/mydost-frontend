import { Card } from "@/components/Card";
import { TeerTabs } from "@/components/TeerTabs";
import { CardRenderer } from "@/components/CardRenderer";
import { teerHistoryTable } from "@/lib/mock-data";
import { Button } from "@/components/Button";

export default function TeerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Teer</h1>
        <p className="text-sm text-ink-600">Follow houses and scan the latest results.</p>
      </div>
      <TeerTabs />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Latest Result">
          <p className="text-sm text-ink-600">Shillong • 02 Aug • Result 48</p>
          <p className="text-xs text-ink-400">Updated 5 mins ago.</p>
          <p className="disclaimer">Entertainment only.</p>
        </Card>
        <CardRenderer card={teerHistoryTable} />
        <Card title="Summary">
          <p className="text-sm text-ink-600">
            Historical patterns show midweek dips with stronger weekend spikes.
          </p>
          <p className="disclaimer">Historical-only summary.</p>
        </Card>
      </div>

      <Card title="Ask mydost">
        <p className="text-sm text-ink-600">
          Launch a chat session focused on the last 30 days of results.
        </p>
        <Button href="/chat?topic=teer" className="mt-4">
          Ask mydost about last 30 days
        </Button>
      </Card>
    </div>
  );
}
