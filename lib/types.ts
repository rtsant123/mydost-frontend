export type Highlight = {
  id: string;
  title: string;
  description: string;
  confidence: number;
  cta?: string;
};

export type MatchSummary = {
  id: string;
  league: string;
  teamA: string;
  teamB: string;
  time: string;
  status: string;
  confidence: number;
};

export type CardResponse = {
  id: string;
  type: "match_preview" | "post_match" | "teer_summary" | "astrology" | "answer" | "warning" | "table";
  title: string;
  confidence?: number;
  bullets?: string[];
  cta?: { label: string; href?: string }[];
  table?: { headers: string[]; rows: string[][] };
  content?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  cards?: CardResponse[];
  text?: string;
};
