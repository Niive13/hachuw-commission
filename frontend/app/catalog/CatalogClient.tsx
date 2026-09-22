"use client";

import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SkeletonCatalogGrid } from "@/components/catalog/SkeletonCatalogGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { BackButton } from "@/components/layout/BackButton";
import { CategoryTabs } from "@/components/catalog/CategoryTabs";
import { CatalogCard } from "@/components/catalog/CatalogCard";
import { CatalogDetailModal } from "@/components/catalog/CatalogDetailModal";
import { catalogService } from "@/services/catalog.service";
import { kategoriService } from "@/services/kategori.service";
import type { Catalog } from "@/types/catalog";
import type { Kategori } from "@/types/kategori";

export function CatalogClient() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingKategoris, setLoadingKategoris] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Fetch kategori list (untuk tabs).
  useEffect(() => {
    let cancelled = false;
    setLoadingKategoris(true);
    kategoriService
      .getAll()
      .then((data) => {
        if (!cancelled) setKategoris(data);
      })
      .catch(() => {
        // silent — tabs fallback ke "All" saja.
      })
      .finally(() => {
        if (!cancelled) setLoadingKategoris(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch catalogs (refetch saat activeSlug berubah).
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    catalogService
      .getAll(activeSlug ?? undefined)
      .then((data) => {
        if (!cancelled) setCatalogs(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Gagal memuat catalog.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeSlug]);

  return (
    <>
      {/* Back Button */}
      <Section className="pt-8">
        <BackButton />
      </Section>

      {/* Header */}
      <Section className="pb-8 pt-8 text-center sm:pt-12">
        <h1 className="font-display text-4xl font-bold text-ink-800 sm:text-5xl">
          Catalog
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-blush-300" />
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-400">
          Pilih jenis commission yang kamu minati. Klik untuk melihat
          portfolio & detail ♡
        </p>
      </Section>

      {/* Filter Tabs */}
      <Section className="pb-8">
        <CategoryTabs
          kategoris={kategoris}
          activeSlug={activeSlug}
          onChange={setActiveSlug}
          loading={loadingKategoris}
        />
      </Section>

      {/* Grid */}
      <Section className="pb-20">
        {loading && <SkeletonCatalogGrid count={6} />}

        {error && (
          <div className="rounded-round border border-danger/30 bg-danger/10 p-6 text-center">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {!loading && !error && catalogs.length === 0 && (
          <EmptyState
            title="Belum ada catalog"
            description="Catalog untuk kategori ini akan segera ditambahkan."
          />
        )}

        {!loading && !error && catalogs.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalogs.map((c) => (
              <CatalogCard
                key={c.id_catalogItem}
                catalog={c}
                onClick={() => setSelectedId(c.id_catalogItem)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Modal */}
      <CatalogDetailModal
        catalogId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}