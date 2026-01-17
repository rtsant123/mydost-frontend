import Link from "next/link";
import { Button } from "@/components/Button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-100 bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/" className="text-lg font-semibold text-ink-900">
            mydost
          </Link>
          <div className="flex items-center gap-3">
            <Button href="/pricing" variant="secondary" size="sm">
              Pricing
            </Button>
            <Button size="sm">Login with Google</Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
