import { Card } from "@/components/Card";
import { CardRenderer } from "@/components/CardRenderer";
import { VoteWidget } from "@/components/VoteWidget";
import { ChatStream } from "@/components/ChatStream";
import { keyFactors, matchBrief, postMatchCards } from "@/lib/mock-data";

export default function MatchPage({ params }: { params: { id: string } }) {
  const matchStatus = "Live";
  const matchEnded = matchStatus === "Final";

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-ink-900">Team A vs Team B</h1>
        <p className="text-sm text-ink-600">Premier League • 7:30 PM • {matchStatus}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <CardRenderer card={matchBrief} />
          <CardRenderer card={keyFactors} />
          <Card title="Crowd Confidence">
            <p className="text-sm text-ink-600">
              Cast your vote to shape the confidence bar for this match.
            </p>
            <VoteWidget />
            <p className="disclaimer">Votes are aggregated in real-time.</p>
          </Card>
          {matchEnded && (
            <div className="space-y-4">
              {postMatchCards.map((card) => (
                <CardRenderer key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>

        <Card title="Live Chat">
          <ChatStream topic="match" matchId={params.id} />
        </Card>
      </div>
    </div>
  );
}
