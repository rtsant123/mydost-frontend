type ConfidenceBarProps = {
  value: number;
};

export function ConfidenceBar({ value }: ConfidenceBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      <div className="h-2 w-full rounded-full bg-ink-100">
        <div
          className="h-2 rounded-full bg-ink-600"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="text-xs text-ink-500">Confidence {clamped}%</p>
    </div>
  );
}
