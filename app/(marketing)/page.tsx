import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function HomePage() {
  return (
    <div className="container-page space-y-12 py-10">
      <section className="relative overflow-hidden rounded-[32px] border border-ink-100 bg-white px-6 py-10 shadow-card sm:px-10">
        <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-ink-100/80 blur-3xl" />
        <div className="absolute -left-10 bottom-8 h-48 w-48 rounded-full bg-ink-200/60 blur-3xl" />
        <div className="relative space-y-6">
          <span className="inline-flex items-center rounded-full border border-ink-200 bg-ink-50 px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-ink-600">
            Mobile-first insight assistant
          </span>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl lg:text-5xl">
              mydost keeps sports, teer, and astrology in one calm, focused feed.
            </h1>
            <p className="max-w-2xl text-base text-ink-600">
              Ask anything, get fast summaries, and switch between domains without losing context. Built for
              mobile sessions and quick decisions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/chat" size="lg">
              Start chatting
            </Button>
            <Button href="/sports" variant="secondary" size="lg">
              View matches
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Dost",
            copy: "Your always-on assistant with memory across domains."
          },
          {
            title: "Sports",
            copy: "Match previews, H2H context, and quick recaps."
          },
          {
            title: "Teer",
            copy: "Live result tracker with clean, readable updates."
          },
          {
            title: "Astrology",
            copy: "Guided intake + personalized chat session."
          },
          {
            title: "Markets",
            copy: "Live crypto and stock prices in one view."
          }
        ].map((item) => (
          <Card key={item.title} title={item.title}>
            <p className="text-sm text-ink-600">{item.copy}</p>
            <Button variant="ghost" size="sm" className="mt-4" href={`/${item.title.toLowerCase()}`}>
              Open {item.title}
            </Button>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "1. Pick a domain",
            copy: "Sports, teer, or astrology — you control the focus."
          },
          {
            title: "2. Ask naturally",
            copy: "Chat in short messages like you would with a friend."
          },
          {
            title: "3. See structured insight",
            copy: "Get clean answers or cards when the question needs it."
          }
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-ink-100 bg-white px-5 py-6 shadow-card">
            <h3 className="text-base font-semibold text-ink-900">{item.title}</h3>
            <p className="mt-2 text-sm text-ink-600">{item.copy}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-ink-100 bg-white px-6 py-6 shadow-card sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink-900">Sign in when you’re ready</h2>
            <p className="text-sm text-ink-600">
              Get memory across domains, save preferences, and sync sessions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
