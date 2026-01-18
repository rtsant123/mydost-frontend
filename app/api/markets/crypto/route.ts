import { NextResponse } from "next/server";

const DEFAULT_IDS = ["bitcoin", "ethereum", "solana"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",").map((id) => id.trim()).filter(Boolean) ?? DEFAULT_IDS;
  const vs = searchParams.get("vs")?.trim() || "usd";

  const url = new URL("https://api.coingecko.com/api/v3/simple/price");
  url.searchParams.set("ids", ids.join(","));
  url.searchParams.set("vs_currencies", vs);
  url.searchParams.set("include_24hr_change", "true");

  const response = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch crypto prices" }, { status: 502 });
  }
  const payload = (await response.json()) as Record<string, Record<string, number>>;

  const data = ids.map((id) => ({
    id,
    price: payload?.[id]?.[vs] ?? null,
    change24h: payload?.[id]?.[`${vs}_24h_change`] ?? null
  }));

  return NextResponse.json({ data });
}
