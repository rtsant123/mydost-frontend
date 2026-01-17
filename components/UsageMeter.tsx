import { clsx } from "clsx";

type UsageMeterProps = {
  used: number;
  total: number;
};

export function UsageMeter({ used, total }: UsageMeterProps) {
  const percent = Math.min(100, Math.round((used / total) * 100));
  return (
    <div className="hidden w-36 flex-col gap-1 sm:flex">
      <div className="flex items-center justify-between text-xs text-ink-500">
        <span>{used}/{total} messages</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-ink-100">
        <div
          className={clsx("h-2 rounded-full", percent > 80 ? "bg-rose-400" : "bg-ink-500")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
