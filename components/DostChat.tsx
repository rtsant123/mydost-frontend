"use client";

import { useMemo, useState } from "react";
import { ChatStream } from "./ChatStream";

const languages = [
  "English",
  "Hindi",
  "Bengali",
  "Assamese",
  "Nepali",
  "Marathi",
  "Tamil",
  "Telugu"
];

export function DostChat() {
  const [language, setLanguage] = useState(languages[0]);
  const contextPrefix = useMemo(() => `Preferred language: ${language}`, [language]);

  return (
    <main className="container-page space-y-6 py-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-400">Dost</p>
        <h1 className="text-2xl font-semibold text-ink-900">Chat</h1>
        <p className="text-sm text-ink-600">One focused chat with your assistant.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
          Language
        </label>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700 outline-none focus:border-ink-300"
        >
          {languages.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <ChatStream
        topic="dost"
        contextPrefix={contextPrefix}
        placeholder={`Ask in ${language}...`}
      />
    </main>
  );
}
