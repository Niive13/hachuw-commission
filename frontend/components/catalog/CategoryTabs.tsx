"use client";

import { cn } from "@/lib/utils";
import type { Kategori } from "@/types/kategori";

interface CategoryTabsProps {
  kategoris: Kategori[];
  activeSlug: string | null; // null = "All"
  onChange: (slug: string | null) => void;
  loading?: boolean;
}

export function CategoryTabs({
  kategoris,
  activeSlug,
  onChange,
  loading,
}: CategoryTabsProps) {
  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="h-10 w-20 animate-pulse rounded-full bg-blush-100" />
        <div className="h-10 w-24 animate-pulse rounded-full bg-blush-100" />
        <div className="h-10 w-28 animate-pulse rounded-full bg-blush-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {/* All */}
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200",
          activeSlug === null
            ? "border-blush-400 bg-blush-400 text-white shadow-soft"
            : "border-blush-200 bg-white text-ink-600 hover:border-blush-300 hover:bg-blush-50 hover:text-blush-500",
        )}
      >
        All
      </button>

      {/* Dynamic kategori */}
      {kategoris.map((k) => (
        <button
          key={k.id_kategori}
          type="button"
          onClick={() => onChange(k.slug)}
          className={cn(
            "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200",
            activeSlug === k.slug
              ? "border-blush-400 bg-blush-400 text-white shadow-soft"
              : "border-blush-200 bg-white text-ink-600 hover:border-blush-300 hover:bg-blush-50 hover:text-blush-500",
          )}
        >
          {k.nama}
        </button>
      ))}
    </div>
  );
}