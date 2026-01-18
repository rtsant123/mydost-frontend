import Link from "next/link";
import { Button } from "./Button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/95 backdrop-blur">
      <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-ink-900">
            mydost
          </Link>
          <Button href="/chat" size="sm" className="sm:hidden">
            Open chat
          </Button>
        </div>
        <nav className="flex items-center gap-2 overflow-x-auto text-sm text-ink-600 sm:gap-4">
          {[
            { label: "Dost", href: "/chat" },
            { label: "Sports", href: "/sports" },
            { label: "Teer", href: "/teer" },
            { label: "Astrology", href: "/astrology" },
            { label: "Markets", href: "/markets" }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-ink-100 px-3 py-1 text-xs font-medium text-ink-700 hover:border-ink-300 hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          <Button href="/register" variant="secondary" size="sm">
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
}
