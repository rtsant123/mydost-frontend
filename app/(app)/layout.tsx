import { AppHeader } from "@/components/AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50">
      <AppHeader />
      <main className="container-page pb-24 pt-6 sm:pb-10">{children}</main>
    </div>
  );
}
