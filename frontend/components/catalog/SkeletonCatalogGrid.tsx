interface SkeletonCatalogGridProps {
  count?: number;
}

export function SkeletonCatalogGrid({ count = 6 }: SkeletonCatalogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-round border border-blush-100 bg-white shadow-soft"
        >
          {/* Cover skeleton */}
          <div className="aspect-video w-full animate-pulse bg-blush-50" />

          {/* Info skeleton */}
          <div className="flex flex-col gap-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-blush-50" />
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-blush-50" />
            <div className="h-3 w-1/4 animate-pulse rounded-full bg-blush-50" />
          </div>
        </div>
      ))}
    </div>
  );
}