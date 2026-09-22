"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Halaman admin tidak pakai Navbar/Footer public.
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {/* pb-20 di mobile: kasih ruang untuk bottom nav (h ~64px). */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}