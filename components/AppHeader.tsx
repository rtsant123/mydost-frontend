import Link from "next/link";
import { Button } from "./Button";
import { PlanBadge } from "./PlanBadge";
import { UsageMeter } from "./UsageMeter";

export function AppHeader() {
  return (
    <header className="border-b border-ink-100 bg-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold text-ink-900">
            mydost
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-ink-600 sm:flex">
            <Link href="/sports" className="hover:text-ink-900">
              Sports
            </Link>
            <Link href="/teer" className="hover:text-ink-900">
              Teer
            </Link>
            <Link href="/astrology" className="hover:text-ink-900">
              Astrology
            </Link>
            <Link href="/chat" className="hover:text-ink-900">
              Chats
            </Link>
            <Link href="/pricing" className="hover:text-ink-900">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <PlanBadge plan="Free" />
          <UsageMeter used={3} total={10} />
          <Button variant="secondary" size="sm">
            Google Login
          </Button>
        </div>
      </div>
    </header>
  );
}
