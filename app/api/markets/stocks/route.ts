import { NextResponse } from "next/server";

const DEFAULT_SYMBOLS = ["AAPL", "TSLA", "MSFT"];

type AlphaVantageQuote = {
  "01. symbol"?: string;
  "05. price"?: string;
  "09. change"?: string;
  "10. change percent"?: string;
};

export async function GET(request: Request) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing ALPHA_VANTAGE_API_KEY" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const symbols =
    searchParams.get("symbols")?.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean) ??
    DEFAULT_SYMBOLS;

  const results = [];
  for (const symbol of symbols) {
    const url = new URL("https://www.alphavantage.co/query");
    url.searchParams.set("function", "GLOBAL_QUOTE");
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("apikey", apiKey);

    const response = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!response.ok) {
      results.push({ symbol, price: null, change: null, changePercent: null });
      continue;
    }
    const payload = (await response.json()) as { "Global Quote"?: AlphaVantageQuote };
    const quote = payload["Global Quote"];
    results.push({
      symbol,
      price: quote?.["05. price"] ?? null,
      change: quote?.["09. change"] ?? null,
      changePercent: quote?.["10. change percent"] ?? null
    });
  }

  return NextResponse.json({ data: results });
}
