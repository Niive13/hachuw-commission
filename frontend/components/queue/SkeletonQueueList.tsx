interface SkeletonQueueListProps {
  count?: number;
}

export function SkeletonQueueList({ count = 3 }: SkeletonQueueListProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-round border border-blush-100 bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:gap-6 sm:p-6"
        >
          {/* Number skeleton */}
          <div className="h-12 w-16 animate-pulse rounded-soft bg-blush-50 sm:h-16 sm:w-20" />

          {/* Divider */}
          <div className="hidden h-16 w-px bg-blush-100 sm:block" />

          {/* Info skeleton */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-5 w-40 animate-pulse rounded-full bg-blush-50" />
            <div className="h-3 w-56 animate-pulse rounded-full bg-blush-50" />
            <div className="h-3 w-32 animate-pulse rounded-full bg-blush-50" />
          </div>

          {/* Status skeleton */}
          <div className="h-7 w-24 animate-pulse rounded-full bg-blush-50" />
        </div>
      ))}
    </div>
  );
}