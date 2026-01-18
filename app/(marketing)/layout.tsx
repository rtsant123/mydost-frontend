import Link from "next/link";
import { Button } from "@/components/Button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/95 backdrop-blur">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/" className="text-lg font-semibold text-ink-900">
            mydost
          </Link>
          <div className="flex items-center gap-3">
            <Button href="/chat" size="sm">
              Open chat
            </Button>
            <Button href="/pricing" variant="secondary" size="sm">
              Pricing
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
