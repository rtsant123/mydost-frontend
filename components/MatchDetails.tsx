"use client";

import useSWR from "swr";
import { API_BASE_URL } from "@/lib/api";
import { Card } from "./Card";
import { Button } from "./Button";

type MatchDetailsProps = {
  matchId: string;
};

type MatchRecord = {
  id: string;
  league?: string;
  teamA?: string;
  teamB?: string;
  startTime?: string;
  status?: string;
  sport?: string;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load match");
  }
  return (await response.json()) as MatchRecord;
};

export function MatchDetails({ matchId }: MatchDetailsProps) {
  const { data, error, isLoading } = useSWR<MatchRecord>(`${API_BASE_URL}/matches/${matchId}`, fetcher, {
    revalidateOnFocus: false
  });

  if (isLoading) {
    return (
      <Card title="Loading match">
        <p className="text-sm text-ink-600">Fetching match details...</p>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card title="Match not available">
        <p className="text-sm text-ink-600">We couldn’t load this match yet.</p>
        <Button href="/sports" variant="secondary" size="sm" className="mt-4">
          Back to matches
        </Button>
      </Card>
    );
  }

  return (
    <Card title={`${data.teamA ?? "Team A"} vs ${data.teamB ?? "Team B"}`}>
      <div className="space-y-2 text-sm text-ink-600">
        <p className="text-xs text-ink-500">{data.league ?? "League"}</p>
        <p>
          {data.startTime ? new Date(data.startTime).toLocaleString() : "Schedule TBD"} •{" "}
          {data.status ?? "Pending"}
        </p>
        {data.sport && <p className="text-xs uppercase tracking-[0.2em] text-ink-400">{data.sport}</p>}
      </div>
    </Card>
  );
}
