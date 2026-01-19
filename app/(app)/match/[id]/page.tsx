import { Card } from "@/components/Card";
import { VoteWidget } from "@/components/VoteWidget";
import { ChatStream } from "@/components/ChatStream";
import { MatchDetails } from "@/components/MatchDetails";

export default function MatchPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <MatchDetails matchId={params.id} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card title="Market Vote">
            <VoteWidget teamA="Team A" teamB="Team B" />
          </Card>
        </div>

        <Card title="Live Chat">
          <ChatStream topic="sports" matchId={params.id} />
        </Card>
      </div>
    </div>
  );
}
