import { SportsTabs } from "@/components/SportsTabs";

export default function SportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Sports</h1>
        <p className="text-sm text-ink-600">Track live matches and key updates.</p>
      </div>
      <SportsTabs matches={[]} />
    </div>
  );
}
