"use client";

import useSWR from "swr";
import { Card } from "./Card";

type CryptoRow = {
  id: string;
  price: number | null;
  change24h: number | null;
};

type StockRow = {
  symbol: string;
  price: string | null;
  change: string | null;
  changePercent: string | null;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Fetch failed");
  }
  return response.json();
};

const formatNumber = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return "—";
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const formatPercent = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

export function MarketsPanel() {
  const { data: crypto, error: cryptoError } = useSWR<{ data: CryptoRow[] }>(
    "/api/markets/crypto",
    fetcher,
    { refreshInterval: 60000 }
  );
  const { data: stocks, error: stocksError } = useSWR<{ data: StockRow[] }>(
    "/api/markets/stocks",
    fetcher,
    { refreshInterval: 120000 }
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Crypto (live)">
        {cryptoError && <p className="text-sm text-ink-600">Crypto data is unavailable.</p>}
        {!crypto && !cryptoError && <p className="text-sm text-ink-600">Loading crypto prices…</p>}
        {crypto && (
          <div className="space-y-3">
            {crypto.data.map((row) => (
              <div key={row.id} className="flex items-center justify-between text-sm">
                <div className="font-medium text-ink-900">{row.id.toUpperCase()}</div>
                <div className="text-ink-700">${formatNumber(row.price)}</div>
                <div className={row.change24h !== null && row.change24h < 0 ? "text-rose-500" : "text-emerald-600"}>
                  {formatPercent(row.change24h)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Stocks (live)">
        {stocksError && (
          <p className="text-sm text-ink-600">Stocks data is unavailable. Add an Alpha Vantage key.</p>
        )}
        {!stocks && !stocksError && <p className="text-sm text-ink-600">Loading stock prices…</p>}
        {stocks && (
          <div className="space-y-3">
            {stocks.data.map((row) => (
              <div key={row.symbol} className="flex items-center justify-between text-sm">
                <div className="font-medium text-ink-900">{row.symbol}</div>
                <div className="text-ink-700">{row.price ?? "—"}</div>
                <div className={row.change && row.change.startsWith("-") ? "text-rose-500" : "text-emerald-600"}>
                  {row.changePercent ?? "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
