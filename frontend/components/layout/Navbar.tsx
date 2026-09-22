"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/rules", label: "Rules" },
  { href: "/terms", label: "Terms" },
  { href: "/catalog", label: "Catalog" },
  { href: "/queue", label: "Queue" },
];

export function Navbar() {
  const pathname = usePathname();
    // const [mobileOpen, setMobileOpen] = useState(false);  // commented out — pakai MobileNav instead

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blush-100 bg-cream-50/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-bold text-blush-500 hover:text-blush-600 transition-colors"
        >
          Hachuw
          <span className="ml-1 text-lg">🌸</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-blush-100 text-blush-600"
                      : "text-ink-600 hover:bg-blush-50 hover:text-blush-500",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

                {/* Mobile Hamburger — commented out, pakai MobileNav instead */}
        {/*
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-blush-50 md:hidden"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
        */}
      </nav>

      {/* Mobile Menu */}
      {/*
      {mobileOpen && (
        <div className="border-t border-blush-100 bg-cream-50 md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-soft px-4 py-2.5 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-blush-100 text-blush-600"
                        : "text-ink-600 hover:bg-blush-50 hover:text-blush-500",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      */}
    </header>
  );
}