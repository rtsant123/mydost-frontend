"use client";

import { useState } from "react";
import useSWR from "swr";
import { MatchSummary } from "@/lib/types";
import { TabsNav } from "./TabsNav";
import { Card } from "./Card";
import { ConfidenceBar } from "./ConfidenceBar";
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
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data } = useSWR<MatchSummary[]>(`${API_BASE_URL}/matches`, fetcher, {
    fallbackData: matches
  });

  return (
    <div className="space-y-6">
      <TabsNav options={tabs} value={active} onChange={setActive} />
      <div className="grid gap-4">
        {data?.map((match) => (
          <Card key={match.id} title={`${match.teamA} vs ${match.teamB}`}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-ink-500">{match.league}</p>
                <p className="text-sm text-ink-700">{match.time} • {match.status}</p>
              </div>
              <Button href={`/match/${match.id}`} variant="secondary" size="sm">
                Open Match
              </Button>
            </div>
            <ConfidenceBar value={match.confidence} />
          </Card>
        ))}
      </div>
    </div>
  );
}
