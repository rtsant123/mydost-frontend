import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function PricingPage() {
  return (
    <div className="container-page space-y-8 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-ink-900">Simple pricing</h1>
        <p className="text-sm text-ink-600">
          Upgrade when you are ready. Manage everything from your dashboard.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="₹99 starter">
          <p className="text-sm text-ink-600">10 messages per day, perfect for daily checks.</p>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-ink-600">
            <li>Sports match briefs</li>
            <li>Teer summaries</li>
            <li>Astrology chat</li>
          </ul>
          <Button className="mt-6 w-full">Go to payment</Button>
        </Card>
        <Card title="₹499 unlimited">
          <p className="text-sm text-ink-600">Unlimited messages and priority streaming.</p>
          <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-ink-600">
            <li>Unlimited chats</li>
            <li>Priority crowd updates</li>
            <li>Early feature access</li>
          </ul>
          <Button className="mt-6 w-full" variant="secondary">
            Contact sales
          </Button>
        </Card>
      </div>
    </div>
  );
}
