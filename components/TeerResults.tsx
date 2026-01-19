"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Card } from "./Card";
import { TabsNav } from "./TabsNav";

type TeerResult = {
  date: string;
  fr: string;
  sr: string;
  market: string;
  updated_ts: number;
};

const TEER_API_BASE_URL =
  process.env.NEXT_PUBLIC_TEER_API_BASE_URL ?? "https://telegram-bot-production-20ad.up.railway.app/api";

const houses = [
  { label: "Shillong", value: "shillong" },
  { label: "Khanapara", value: "khanapara" },
  { label: "Juwai", value: "juwai" },
  { label: "Jowai", value: "jowai" },
  { label: "Night", value: "night" },
  { label: "Bhutan", value: "bhutan" }
];

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as TeerResult;
};

const formatUpdated = (updatedTs?: number) => {
  if (!updatedTs) return "Unknown";
  const date = new Date(updatedTs * 1000);
  return date.toLocaleString();
};

export function TeerResults() {
  const [active, setActive] = useState(houses[0].value);
  const endpoint = useMemo(
    () => `${TEER_API_BASE_URL}/results/${active}`,
    [active]
  );
  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false
  });

  return (
    <div className="space-y-5">
      <TabsNav options={houses} value={active} onChange={setActive} />
      <Card title="Latest Result">
        {isLoading && <p className="text-sm text-ink-500">Loading results…</p>}
        {error && (
          <p className="text-sm text-rose-500">
            Could not load results. Try again.
          </p>
        )}
        {data && (
          <div className="space-y-2 text-sm text-ink-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink-500">
                {data.market}
              </span>
              <span>{data.date}</span>
            </div>
            <div className="flex gap-6 text-base font-semibold text-ink-900">
              <span>FR: {data.fr}</span>
              <span>SR: {data.sr}</span>
            </div>
            <p className="text-xs text-ink-400">Updated {formatUpdated(data.updated_ts)}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
