import { Badge } from "@/components/ui/Badge";
import { formatRupiahRange } from "@/lib/utils";
import type { Catalog } from "@/types/catalog";

interface CatalogCardProps {
  catalog: Catalog;
  onClick?: () => void;
}

export function CatalogCard({ catalog, onClick }: CatalogCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-round border border-blush-100 bg-white text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-blush-200 hover:shadow-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-blush-200"
    >
      {/* Cover image — aspect-video (16:9), object-cover (crop minimal untuk landscape) */}
      <div className="relative aspect-video w-full overflow-hidden bg-cream-100">
        {catalog.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={catalog.cover_url}
            alt={catalog.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl text-blush-300">
            🌸
          </div>
        )}

        {/* Kategori badge */}
        <div className="absolute left-3 top-3">
            <Badge variant="pink">{catalog.kategori?.nama ?? "—"}</Badge>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-bold text-ink-800 transition-colors group-hover:text-blush-500">
          {catalog.nama}
        </h3>
        <p className="font-display text-base font-bold text-blush-500">
          {formatRupiahRange(catalog.price, catalog.price_max)}
        </p>
        <p className="mt-auto text-xs font-semibold uppercase tracking-wide text-ink-400 transition-colors group-hover:text-blush-400">
          Lihat detail →
        </p>
      </div>
    </button>
  );
}