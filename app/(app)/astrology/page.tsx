"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { ChatStream } from "@/components/ChatStream";

type IntakeForm = {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  focus: string;
};

const focusOptions = ["General", "Career", "Love", "Health", "Study", "Family", "Travel"];

export default function AstrologyPage() {
  const [form, setForm] = useState<IntakeForm>({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    focus: "General"
  });
  const [started, setStarted] = useState(false);

  const contextPrefix = useMemo(() => {
    if (!started) return "";
    return [
      "Astrology intake details:",
      form.name ? `Name: ${form.name}` : null,
      form.birthDate ? `Date of birth: ${form.birthDate}` : null,
      form.birthTime ? `Time of birth: ${form.birthTime}` : null,
      form.birthPlace ? `Place of birth: ${form.birthPlace}` : null,
      form.focus ? `Focus area: ${form.focus}` : null
    ]
      .filter(Boolean)
      .join("\n");
  }, [form, started]);

  const canStart = form.birthDate && form.birthPlace;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-ink-900">Astrology</h1>
        <p className="text-sm text-ink-600">
          Enter your birth details to personalize the reading, then start a private chat.
        </p>
      </div>

      <Card title="Astrology intake">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-ink-600">
            Full name
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Optional"
              className="w-full rounded-2xl border border-ink-100 px-4 py-3 text-sm text-ink-900 outline-none focus:border-ink-300"
            />
          </label>
          <label className="space-y-2 text-sm text-ink-600">
            Focus area
            <select
              value={form.focus}
              onChange={(event) => setForm((prev) => ({ ...prev, focus: event.target.value }))}
              className="w-full rounded-2xl border border-ink-100 px-4 py-3 text-sm text-ink-900 outline-none focus:border-ink-300"
            >
              {focusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-ink-600">
            Date of birth
            <input
              type="date"
              value={form.birthDate}
              onChange={(event) => setForm((prev) => ({ ...prev, birthDate: event.target.value }))}
              className="w-full rounded-2xl border border-ink-100 px-4 py-3 text-sm text-ink-900 outline-none focus:border-ink-300"
            />
          </label>
          <label className="space-y-2 text-sm text-ink-600">
            Time of birth
            <input
              type="time"
              value={form.birthTime}
              onChange={(event) => setForm((prev) => ({ ...prev, birthTime: event.target.value }))}
              className="w-full rounded-2xl border border-ink-100 px-4 py-3 text-sm text-ink-900 outline-none focus:border-ink-300"
            />
          </label>
          <label className="space-y-2 text-sm text-ink-600 md:col-span-2">
            Place of birth
            <input
              value={form.birthPlace}
              onChange={(event) => setForm((prev) => ({ ...prev, birthPlace: event.target.value }))}
              placeholder="City, Country"
              className="w-full rounded-2xl border border-ink-100 px-4 py-3 text-sm text-ink-900 outline-none focus:border-ink-300"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-ink-400">
            We use your details to personalize the reading. Entertainment only.
          </p>
          <button
            type="button"
            onClick={() => setStarted(true)}
            disabled={!canStart}
            className="rounded-2xl bg-ink-900 px-5 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:bg-ink-200"
          >
            {started ? "Update session" : "Start session"}
          </button>
        </div>
      </Card>

      <Card title="Astrology chat">
        {started ? (
          <ChatStream
            topic="astrology"
            contextPrefix={contextPrefix}
            placeholder="Ask about your chart, timing, or compatibility..."
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-ink-100 px-5 py-8 text-center text-sm text-ink-500">
            Complete the intake form to start your session.
          </div>
        )}
      </Card>
    </div>
  );
}
