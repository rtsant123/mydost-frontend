import { CardResponse, Highlight, MatchSummary } from "./types";

export const homeHighlights: Highlight[] = [
  {
    id: "hl-1",
    title: "Cricket: Super Kings vs Titans",
    description: "Momentum favors Super Kings after strong powerplay trends.",
    confidence: 72,
    cta: "Open match"
  },
  {
    id: "hl-2",
    title: "Teer: Shillong House",
    description: "Midweek patterns show improved close rates.",
    confidence: 64,
    cta: "View teer"
  },
  {
    id: "hl-3",
    title: "Astrology",
    description: "Mercury focus favors short planning sessions today.",
    confidence: 58,
    cta: "Ask mydost"
  }
];

export const matchList: MatchSummary[] = [
  {
    id: "match-101",
    league: "Premier League",
    teamA: "City",
    teamB: "United",
    time: "7:30 PM",
    status: "Live",
    confidence: 61
  },
  {
    id: "match-102",
    league: "IPL",
    teamA: "Royals",
    teamB: "Knights",
    time: "9:00 PM",
    status: "Upcoming",
    confidence: 54
  }
];

export const matchBrief: CardResponse = {
  id: "brief-1",
  type: "match_preview",
  title: "AI Match Brief",
  confidence: 68,
  bullets: [
    "Top-order stability favors the home side.",
    "Weather impact minimal; expect full overs.",
    "Bowling depth balanced, edge to Team A."
  ]
};

export const keyFactors: CardResponse = {
  id: "factors-1",
  type: "answer",
  title: "Key Factors",
  bullets: [
    "Pitch assisting swing early on.",
    "Team B lacks finishing option tonight.",
    "Crowd momentum currently positive for Team A."
  ]
};

export const postMatchCards: CardResponse[] = [
  {
    id: "post-1",
    type: "post_match",
    title: "Post-match Recap",
    bullets: [
      "Team A dominated the middle overs with disciplined bowling.",
      "Finisher scored 42 off 18 to seal the chase."
    ]
  },
  {
    id: "post-2",
    type: "answer",
    title: "Crowd Expected vs Actual",
    bullets: [
      "Crowd expected Team A by 62%, actual outcome aligned.",
      "Draw votes peaked at 12% before final innings."
    ]
  }
];

export const teerHistoryTable: CardResponse = {
  id: "teer-table",
  type: "table",
  title: "Recent History",
  table: {
    headers: ["Date", "House", "Result"],
    rows: [
      ["02 Aug", "Shillong", "48"],
      ["01 Aug", "Shillong", "15"],
      ["31 Jul", "Shillong", "90"],
      ["30 Jul", "Shillong", "27"]
    ]
  }
};
