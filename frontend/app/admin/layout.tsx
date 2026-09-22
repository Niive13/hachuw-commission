"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { authClientService } from "@/services/auth.client.service";
import { LoadingState } from "@/components/ui/LoadingState";
import { ToastProvider } from "@/components/ui/Toast";
import type { Admin } from "@/types/admin";

const MENU_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/catalog", label: "Catalog", icon: "🎨" },
  { href: "/admin/kategori", label: "Kategori", icon: "🏷️" },
  { href: "/admin/artwork", label: "Artwork", icon: "🖼️" },
  { href: "/admin/queue", label: "Queue", icon: "📋" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Halaman login tidak perlu cek auth.
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    authClientService
      .me()
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          router.replace("/admin/login");
          return;
        }
        setAdmin(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router, isLoginPage, pathname]);

  // Close sidebar saat route berubah (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

    // Halaman login: render tanpa shell
  if (isLoginPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  // Loading: tampilkan spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50">
        <LoadingState message="Memuat..." />
      </div>
    );
  }

  // Belum login (sudah di-redirect, tapi untuk safety)
  if (!admin) {
    return null;
  }

  async function handleLogout() {
    await authClientService.logout();
    router.replace("/admin/login");
  }

  return (
    <ToastProvider>
    <div className="flex min-h-screen bg-cream-50">
      {/* Sidebar (desktop) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-blush-100 bg-white transition-transform duration-300 md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="border-b border-blush-100 p-6">
          <Link href="/admin" className="font-display text-xl font-bold text-blush-500">
            Hachuw <span className="text-sm">Admin</span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 p-4">
          {MENU_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-soft px-4 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-blush-100 text-blush-600"
                    : "text-ink-600 hover:bg-blush-50 hover:text-blush-500",
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-blush-100 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            {/* Profile Photo */}
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-blush-200 bg-blush-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hachuw-profile.png"
                alt="Hachuw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-ink-400">Signed in as</p>
              <p className="truncate text-sm font-semibold text-ink-800">
                {admin.username}
              </p>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="mb-2 block rounded-soft px-4 py-2 text-xs font-semibold text-ink-500 hover:bg-blush-50 hover:text-blush-500"
          >
            🌐 Lihat Public Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-soft px-4 py-2 text-left text-xs font-semibold text-danger hover:bg-danger/10"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-ink-900/30 md:hidden"
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="flex items-center justify-between border-b border-blush-100 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 hover:bg-blush-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <span className="font-display text-lg font-bold text-blush-500">
            Hachuw Admin
          </span>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
    </ToastProvider>
  );
}