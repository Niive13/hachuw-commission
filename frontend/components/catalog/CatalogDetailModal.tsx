"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRupiahRange } from "@/lib/utils";
import { catalogService } from "@/services/catalog.service";
import type { CatalogDetail } from "@/types/catalog";
import { OrderHereButton } from "@/components/catalog/OrderHereButton";

interface CatalogDetailModalProps {
  catalogId: number | null;
  onClose: () => void;
}

export function CatalogDetailModal({
  catalogId,
  onClose,
}: CatalogDetailModalProps) {
  const [detail, setDetail] = useState<CatalogDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Fetch detail saat catalogId berubah
  useEffect(() => {
    if (!catalogId) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    catalogService
      .getDetail(catalogId)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Gagal memuat detail.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [catalogId]);

  // Kunci scroll body saat modal terbuka
  useEffect(() => {
    if (catalogId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [catalogId]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(null);
        else onClose();
      }
    }
    if (catalogId) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [catalogId, lightbox, onClose]);

  if (!catalogId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-900/40 p-4 backdrop-blur-sm sm:p-8"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative my-4 w-full max-w-3xl rounded-round border border-blush-100 bg-cream-50 shadow-hover"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-400 shadow-soft transition-colors hover:bg-blush-100 hover:text-blush-500"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>

          {loading && <LoadingState message="Memuat detail..." />}

          {error && (
            <div className="p-8 text-center">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {!loading && !error && detail && (
            <div className="flex flex-col">
              {/* Cover */}
              {detail.cover_url && (
                <div className="relative aspect-video w-full overflow-hidden rounded-t-round bg-gradient-to-br from-blush-50 to-lavender-50">
                  <Image
                    src={detail.cover_url}
                    alt={detail.nama}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Info */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Badge variant="lavender">
                      {detail.kategori?.nama ?? "—"}
                    </Badge>
                    <h2 className="mt-3 font-display text-2xl font-bold text-ink-800 sm:text-3xl">
                      {detail.nama}
                    </h2>
                  </div>
                  <p className="font-display text-2xl font-bold text-blush-500">
                    {formatRupiahRange(detail.price, detail.price_max)}
                  </p>
                </div>

                {/* ORDER HERE BUTTON */}
                <div className="mt-5 flex justify-center sm:justify-start">
                  <OrderHereButton />
                </div>

                {/* Deskripsi */}
                {detail.deskripsi && (
                  <div className="mt-6 rounded-soft border border-blush-100 bg-blush-50/40 p-4">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">
                      Deskripsi
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                      {detail.deskripsi}
                    </p>
                  </div>
                )}

                {/* Portfolio gallery */}
                <div className="mt-8">
                  <h3 className="font-display text-lg font-bold text-ink-800">
                    Portfolio
                  </h3>
                  <div className="mt-1 h-1 w-10 rounded-full bg-blush-300" />

                  {detail.portfolio_images.length === 0 ? (
                    <div className="mt-4">
                      <EmptyState
                        title="Belum ada portfolio"
                        description="Portfolio untuk kategori ini akan segera ditambahkan."
                        icon={<span className="text-4xl">🖼️</span>}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {detail.portfolio_images.map((img) => (
                        <button
                          key={img.id_portfolioImage}
                          type="button"
                          onClick={() => setLightbox(img.url)}
                          className="group relative aspect-square overflow-hidden rounded-soft border border-blush-100 bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-hover"
                        >
                          <Image
                          src={img.url}
                          alt={detail.nama}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-ink-900/80 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-600 transition-colors hover:bg-white"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[90vw]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt="Portfolio preview"
              className="max-h-[90vh] max-w-[90vw] rounded-soft object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}