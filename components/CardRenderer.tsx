import { CardResponse } from "@/lib/types";
import { Card } from "./Card";
import { ConfidenceBar } from "./ConfidenceBar";
import { Button } from "./Button";

const typeStyles: Record<CardResponse["type"], string> = {
  match_preview: "border-l-4 border-l-emerald-300",
  post_match: "border-l-4 border-l-indigo-300",
  teer_summary: "border-l-4 border-l-orange-300",
  astrology: "border-l-4 border-l-purple-300",
  answer: "border-l-4 border-l-ink-300",
  warning: "border-l-4 border-l-rose-300",
  table: "border-l-4 border-l-ink-200"
};

export function CardRenderer({ card }: { card: CardResponse }) {
  return (
    <Card title={card.title} className={typeStyles[card.type]}>
      {card.confidence !== undefined && <ConfidenceBar value={card.confidence} />}
      {card.content && <p className="text-sm text-ink-600">{card.content}</p>}
      {card.bullets && (
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink-600">
          {card.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
      {card.table && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-ink-600">
            <thead className="text-xs uppercase text-ink-400">
              <tr>
                {card.table.headers.map((header) => (
                  <th key={header} className="px-3 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {card.table.rows.map((row, index) => (
                <tr key={`${row[0]}-${index}`} className="border-t border-ink-100">
                  {row.map((cell) => (
                    <td key={cell} className="px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {card.cta && (
        <div className="flex flex-wrap gap-2">
          {card.cta.map((item) => (
            <Button key={item.label} href={item.href} variant="secondary" size="sm">
              {item.label}
            </Button>
          ))}
        </div>
      )}
      <p className="disclaimer">Entertainment only. Not financial advice.</p>
    </Card>
  );
}
