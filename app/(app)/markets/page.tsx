import { MarketsPanel } from "@/components/MarketsPanel";

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Markets</h1>
        <p className="text-sm text-ink-600">Live crypto and stock prices in one place.</p>
      </div>
      <MarketsPanel />
    </div>
  );
}
