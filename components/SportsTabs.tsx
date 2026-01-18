"use client";

import { useState } from "react";
import useSWR from "swr";
import { MatchSummary } from "@/lib/types";
import { TabsNav } from "./TabsNav";
import { Card } from "./Card";
import { Button } from "./Button";
import { API_BASE_URL } from "@/lib/api";

const tabs = [
  { label: "Cricket", value: "cricket" },
  { label: "Football", value: "football" }
];

type SportsTabsProps = {
  matches: MatchSummary[];
};

export function SportsTabs({ matches }: SportsTabsProps) {
  const [active, setActive] = useState("cricket");
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load matches");
    }
    return (await response.json()) as MatchSummary[];
  };
  const { data, error, isLoading } = useSWR<MatchSummary[]>(`${API_BASE_URL}/matches`, fetcher, {
    fallbackData: matches
  });
  const filtered = (data ?? []).filter((match) => {
    const sport = (match as any).sport;
    return sport ? sport === active : true;
  });

  return (
    <div className="space-y-6">
      <TabsNav options={tabs} value={active} onChange={setActive} />
      {isLoading && (
        <Card title="Loading matches">
          <p className="text-sm text-ink-600">Fetching the latest fixtures...</p>
        </Card>
      )}
      {error && (
        <Card title="Could not load matches">
          <p className="text-sm text-ink-600">Please refresh or try again in a moment.</p>
        </Card>
      )}
      {!isLoading && !error && filtered.length === 0 && (
        <Card title="No live matches">
          <p className="text-sm text-ink-600">Check back later for updated fixtures.</p>
        </Card>
      )}
      <div className="grid gap-4">
        {filtered.map((match) => (
          <Card key={match.id} title={`${match.teamA} vs ${match.teamB}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-ink-500">{match.league}</p>
                <p className="text-sm text-ink-700">
                  {match.time} • {match.status}
                </p>
              </div>
              <Button href={`/match/${match.id}`} variant="secondary" size="sm">
                Open Match
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
