"use client";

import { useState } from "react";
import { clsx } from "clsx";

type VoteWidgetProps = {
  teamA: string;
  teamB: string;
  onVote?: (vote: "A" | "Draw" | "B") => void;
};

const defaultMarket = { A: 52, Draw: 14, B: 34 };

export function VoteWidget({ teamA, teamB, onVote }: VoteWidgetProps) {
  const [selected, setSelected] = useState<"A" | "Draw" | "B" | null>(null);
  const [market] = useState(defaultMarket);

  const handleVote = (vote: "A" | "Draw" | "B") => {
    setSelected(vote);
    onVote?.(vote);
  };

  const buttonStyle = (vote: "A" | "Draw" | "B") =>
    clsx(
      "w-full rounded-2xl border px-4 py-3 text-left transition",
      selected === vote
        ? "border-ink-900 bg-ink-900 text-white"
        : "border-ink-100 bg-white text-ink-700 hover:border-ink-300"
    );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-ink-400">Prediction Market</p>
        <p className="text-sm text-ink-600">Vote like Polymarket. Prices move with votes.</p>
      </div>
      <div className="space-y-3">
        {[
          { key: "A" as const, label: teamA, value: market.A },
          { key: "Draw" as const, label: "Draw", value: market.Draw },
          { key: "B" as const, label: teamB, value: market.B }
        ].map((option) => (
          <button
            key={option.key}
            className={buttonStyle(option.key)}
            onClick={() => handleVote(option.key)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.label}</span>
              <span className={clsx("text-xs", selected === option.key && "text-white")}>
                {option.value}%
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-ink-100">
              <div
                className={clsx(
                  "h-2 rounded-full",
                  option.key === "A" && "bg-emerald-400",
                  option.key === "Draw" && "bg-amber-300",
                  option.key === "B" && "bg-sky-400"
                )}
                style={{ width: `${option.value}%` }}
              />
            </div>
            {selected === option.key && <p className="mt-2 text-xs">Your vote is in.</p>}
          </button>
        ))}
      </div>
    </div>
  );
}
