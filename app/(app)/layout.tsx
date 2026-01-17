import { AppHeader } from "@/components/AppHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50">
      <AppHeader />
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
