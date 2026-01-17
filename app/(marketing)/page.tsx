import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { homeHighlights } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="container-page space-y-10 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="badge">Super fast, mobile-first insights</p>
            <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">
              mydost keeps your sports, teer, and astrology insights in one clean feed.
            </h1>
            <p className="text-base text-ink-600">
              Tap into daily highlights, follow your favorite teams, and chat with a streaming assistant.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/register" size="lg">
              Get started
            </Button>
            <Button href="/sports" variant="secondary" size="lg">
              Explore sports
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["Sports", "Teer", "Astrology"].map((topic) => (
              <Card key={topic} title={topic}>
                <p className="text-sm text-ink-600">
                  Personalized cards, confidence bars, and crowd insights.
                </p>
                <Button variant="ghost" size="sm" className="mt-4" href={`/${topic.toLowerCase()}`}>
                  Open {topic}
                </Button>
              </Card>
            ))}
          </div>
        </div>
        <Card title="Today’s highlights" className="h-fit">
          <div className="space-y-4">
            {homeHighlights.map((highlight) => (
              <div key={highlight.id} className="rounded-xl border border-ink-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900">{highlight.title}</h3>
                    <p className="text-xs text-ink-500">{highlight.description}</p>
                  </div>
                  <span className="badge">{highlight.cta}</span>
                </div>
                <div className="mt-3">
                  <ConfidenceBar value={highlight.confidence} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="card">
        <div className="card-section flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink-900">Login to unlock your personalized feed</h2>
            <p className="text-sm text-ink-600">
              Save preferences, track plans, and keep all your chat sessions synced.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Login with Google</Button>
            <Link href="/register" className="text-sm font-medium text-ink-600">
              New here? Set preferences
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
