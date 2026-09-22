import { cn } from "@/lib/utils";
import {
  QUEUE_STATUS_LABEL,
  QUEUE_STATUS_STYLE,
} from "@/lib/queue-status";
import type { QueueItem } from "@/types/queue";

interface QueueCardProps {
  queue: QueueItem;
  variant?: "active" | "completed";
}

export function QueueCard({ queue, variant = "active" }: QueueCardProps) {
  const statusLabel = QUEUE_STATUS_LABEL[queue.queue_status];
  const statusStyle = QUEUE_STATUS_STYLE[queue.queue_status];
  const isCompleted = variant === "completed";

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-round border bg-white p-5 shadow-soft transition-all duration-300 sm:flex-row sm:items-center sm:gap-6 sm:p-6",
        isCompleted
          ? "border-ink-400/20 opacity-80 hover:opacity-100"
          : "border-blush-100 hover:-translate-y-0.5 hover:border-blush-200 hover:shadow-card",
      )}
    >
      {/* Queue Number / Check icon */}
      <div className="flex flex-shrink-0 items-center gap-4 sm:flex-col sm:gap-1">
        {isCompleted ? (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/20 font-display text-2xl font-bold text-success sm:h-14 sm:w-14">
            ✓
          </span>
        ) : (
          <span className="font-display text-4xl font-bold text-blush-400 sm:text-5xl">
            {queue.queue_number_formatted}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="hidden h-16 w-px bg-blush-100 sm:block" />

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2">
        <h3
          className={cn(
            "font-display text-lg font-bold",
            isCompleted ? "text-ink-500" : "text-ink-800",
          )}
        >
          {queue.customer_display_name}
        </h3>

        {queue.catalog.nama && (
          <p className="text-sm text-ink-500">
            <span className="font-semibold text-ink-600">
              {queue.catalog.nama}
            </span>
            {queue.catalog.kategori && (
              <span className="text-ink-400">
                {" · "}
                {queue.catalog.kategori.nama}
              </span>
            )}
          </p>
        )}

        {queue.public_note && (
          <p className="mt-1 text-xs italic text-ink-400 line-clamp-2">
            &ldquo;{queue.public_note}&rdquo;
          </p>
        )}

        {queue.estimated_completion && !isCompleted && (
          <p className="mt-1 text-xs text-ink-400">
            Est. selesai:{" "}
            <span className="font-semibold text-ink-600">
              {new Date(queue.estimated_completion).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </span>
          </p>
        )}

        {isCompleted && queue.order_date && (
          <p className="mt-1 text-xs text-ink-400">
            Selesai ·{" "}
            <span className="font-semibold text-ink-500">
              {new Date(queue.order_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <span
          className={cn(
            "inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            statusStyle,
          )}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
}