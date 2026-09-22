import type { QueueStatus } from "@/types/queue";

export const QUEUE_STATUS_LABEL: Record<QueueStatus, string> = {
  WAITING: "Waiting",
  SKETCH: "Sketch",
  REVISION: "Revision",
  RENDERING: "Rendering",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const QUEUE_STATUS_STYLE: Record<QueueStatus, string> = {
  WAITING: "bg-peach-100 text-ink-600 border-peach-200",
  SKETCH: "bg-lavender-100 text-lavender-500 border-lavender-200",
  REVISION: "bg-warning/20 text-ink-600 border-warning/40",
  RENDERING: "bg-info/20 text-ink-600 border-info/40",
  COMPLETED: "bg-success/20 text-ink-600 border-success/40",
  CANCELLED: "bg-danger/20 text-danger border-danger/40",
};