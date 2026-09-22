"use client";

import { useEffect, useState } from "react";
import { artworkService } from "@/services/artwork.service";
import type { Artwork } from "@/types/artwork";

export function MarqueeSection() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    artworkService
      .getAll()
      .then((data) => {
        if (!cancelled) setArtworks(data);
      })
      .catch(() => {
        // Silent — kalau gagal, marquee kosong.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Jangan render section kalau tidak ada artwork.
  if (!loading && artworks.length === 0) {
    return null;
  }

  // Duplikat untuk seamless loop.
  const images = artworks.map((a) => a.url).filter(Boolean) as string[];
  const duplicated = [...images, ...images];

  return (
    <section className="overflow-hidden pb-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-bold text-ink-800 sm:text-3xl">
          Some of My Works
        </h2>
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-blush-300" />
        <p className="mt-3 text-sm text-ink-400">
          A glimpse of my recent commissions ♡
        </p>
      </div>

      {/* Marquee (render placeholder saat loading) */}
      <div className="marquee-container group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream-50 to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream-50 to-transparent sm:w-24" />

        <div className="marquee-track flex gap-4 group-hover:[animation-play-state:paused]">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 w-64 flex-shrink-0 animate-pulse rounded-round border border-blush-100 bg-blush-50 sm:h-48 sm:w-72"
                />
              ))
            : duplicated.map((src, i) => (
                <div
                  key={i}
                  className="relative h-40 w-64 flex-shrink-0 overflow-hidden rounded-round border border-blush-100 shadow-soft sm:h-48 sm:w-72"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Artwork ${(i % images.length) + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}