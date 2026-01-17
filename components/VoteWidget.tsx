"use client";

import { useState } from "react";
import { Button } from "./Button";
import { clsx } from "clsx";

type VoteWidgetProps = {
  onVote?: (vote: "A" | "Draw" | "B") => void;
};

export function VoteWidget({ onVote }: VoteWidgetProps) {
  const [selected, setSelected] = useState<"A" | "Draw" | "B" | null>(null);

  const handleVote = (vote: "A" | "Draw" | "B") => {
    setSelected(vote);
    onVote?.(vote);
  };

  const buttonStyle = (vote: "A" | "Draw" | "B") =>
    clsx(
      "flex-1",
      selected === vote ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-700"
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button variant="secondary" className={buttonStyle("A")} onClick={() => handleVote("A")}>
          Team A
        </Button>
        <Button
          variant="secondary"
          className={buttonStyle("Draw")}
          onClick={() => handleVote("Draw")}
        >
          Draw
        </Button>
        <Button variant="secondary" className={buttonStyle("B")} onClick={() => handleVote("B")}>
          Team B
        </Button>
      </div>
      {selected && <p className="text-xs text-ink-500">Thanks for voting!</p>}
    </div>
  );
}
