 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Button } from "./Button";
import { PlanBadge } from "./PlanBadge";
import { UsageMeter } from "./UsageMeter";

const navLinks = [
  { href: "/sports", label: "Sports" },
  { href: "/teer", label: "Teer" },
  { href: "/astrology", label: "Astrology" },
  { href: "/chat", label: "Chats" },
  { href: "/pricing", label: "Pricing" }
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-ink-100 bg-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold text-ink-900">
            mydost
          </Link>
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={clsx(
                    "transition hover:text-ink-900",
                    active ? "text-ink-900 font-medium" : "text-ink-600"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
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
      <nav className="border-t border-ink-100 sm:hidden">
        <div className="container-page flex items-center gap-3 overflow-x-auto py-3 text-xs text-ink-600">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "whitespace-nowrap rounded-full border px-3 py-1 transition",
                  active
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-ink-200 bg-white text-ink-600 hover:border-ink-300"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
