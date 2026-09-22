"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { settingsService, type CommissionStatus } from "@/services/settings.service";

export function HeroSection() {
  const [status, setStatus] = useState<CommissionStatus>("open");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    settingsService
      .getPublic()
      .then((data) => {
        if (!cancelled) setStatus(data.commission_status);
      })
      .catch(() => {
        // Fallback: anggap open.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isOpen = status === "open";

  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blush-100 opacity-60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-lavender-100 opacity-60 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2 md:gap-14">
        {/* Text */}
        <div className="order-2 flex flex-col items-center text-center md:order-1 md:items-start md:text-left">
          {/* Status Badge */}
          <span
            className={
              isOpen
                ? "inline-flex items-center gap-2 rounded-full border border-blush-200 bg-blush-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blush-500"
                : "inline-flex items-center gap-2 rounded-full border border-danger/40 bg-danger/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-danger"
            }
          >
            {isOpen ? "✨ Open for Commission" : "🚫 Commission Closed"}
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-ink-800 sm:text-5xl lg:text-6xl">
            Hi, I&apos;m{" "}
            <span className="text-blush-500">Hachuw</span>
          </h1>

          <p className="mt-3 font-display text-lg text-ink-400 sm:text-xl">
            Freelance Illustrator
          </p>

          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-600">
            Menghadirkan ilustrasi custom untuk karakter, fanart, couple,
            dan PNGTuber — dibuat dengan cinta dan detail. 💖
          </p>

          {/* Notice when closed */}
          {!loading && !isOpen && (
            <div className="mt-5 max-w-md rounded-soft border border-warning/40 bg-warning/10 px-4 py-3 text-left text-sm text-ink-600">
              <p className="font-semibold text-ink-700">
                ⚠️ Commission sedang closed
              </p>
              <p className="mt-1 text-xs">
                Slot saat ini sedang penuh. Kamu tetap bisa lihat-lihat catalog
                atau chat aku untuk tanya-tanya / masuk waiting list ♡
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Button href="/catalog" size="lg">
              View Catalog →
            </Button>
            <Button href="/queue" variant="outline" size="lg">
              Check Queue
            </Button>
          </div>
        </div>

        {/* Character Image */}
        <div className="order-1 flex justify-center md:order-2">
          <div className="relative">
            <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-br from-blush-200 via-lavender-200 to-peach-200 blur-2xl opacity-70" />

            <div className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-white bg-cream-100 shadow-card sm:h-72 sm:w-72 lg:h-80 lg:w-80">
              <Image
                src="/hachuw-profile.png"
                alt="Hachuw character"
                fill
                sizes="(max-width: 768px) 224px, 320px"
                className="object-cover"
                priority
              />
            </div>

            <div className="absolute -bottom-2 -right-2 rounded-round bg-white px-4 py-2 shadow-card">
              <p className="font-display text-sm font-bold text-blush-500">
                🌸 Hachuw
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}