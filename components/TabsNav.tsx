"use client";

import { clsx } from "clsx";

export type TabOption = {
  label: string;
  value: string;
};

type TabsNavProps = {
  options: TabOption[];
  value: string;
  onChange: (value: string) => void;
};

export function TabsNav({ options, value, onChange }: TabsNavProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-full border border-ink-100 bg-white p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            value === option.value
              ? "bg-ink-900 text-white"
              : "text-ink-600 hover:bg-ink-100"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
