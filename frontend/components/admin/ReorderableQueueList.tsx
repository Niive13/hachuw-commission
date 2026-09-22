"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  QUEUE_STATUS_LABEL,
  QUEUE_STATUS_STYLE,
} from "@/lib/queue-status";
import type { AdminQueue } from "@/types/admin-queue";

interface ReorderableQueueListProps {
  queues: AdminQueue[];
  onSave: (orderedIds: number[]) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

export function ReorderableQueueList({
  queues,
  onSave,
  onCancel,
  saving,
}: ReorderableQueueListProps) {
  const [items, setItems] = useState<AdminQueue[]>(queues);

  // Update items kalau props berubah.
  useEffect(() => {
    setItems(queues);
  }, [queues]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // prevent accidental drag on click
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id_queue === active.id);
    const newIndex = items.findIndex((i) => i.id_queue === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setItems((prev) => arrayMove(prev, oldIndex, newIndex));
  }

  async function handleSave() {
    const orderedIds = items.map((i) => i.id_queue);
    await onSave(orderedIds);
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="rounded-round border border-lavender-200 bg-lavender-50 p-4 text-sm text-ink-600">
        🖐️ <strong>Drag & drop</strong> untuk mengatur urutan. Klik{" "}
        <strong>Simpan Urutan</strong> kalau sudah selesai.
      </div>

      {/* Sortable List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id_queue)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {items.map((queue, index) => (
              <SortableQueueItem
                key={queue.id_queue}
                queue={queue}
                displayNumber={index + 1}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          Batal
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Urutan"}
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// SORTABLE ITEM
// ============================================================

interface SortableQueueItemProps {
  queue: AdminQueue;
  displayNumber: number;
}

function SortableQueueItem({ queue, displayNumber }: SortableQueueItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: queue.id_queue });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  const statusLabel = QUEUE_STATUS_LABEL[queue.queue_status];
  const statusStyle = QUEUE_STATUS_STYLE[queue.queue_status];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-4 rounded-round border border-blush-100 bg-white p-4 shadow-soft transition-shadow",
        isDragging && "shadow-hover",
      )}
    >
      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="flex h-10 w-8 cursor-grab flex-shrink-0 items-center justify-center rounded-soft text-ink-400 transition-colors hover:bg-blush-50 hover:text-blush-500 active:cursor-grabbing"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="9" cy="6" r="1.5" />
          <circle cx="15" cy="6" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="18" r="1.5" />
          <circle cx="15" cy="18" r="1.5" />
        </svg>
      </button>

      {/* Number */}
      <span className="font-display text-2xl font-bold text-blush-400 flex-shrink-0 w-10 text-center">
        {String(displayNumber).padStart(2, "0")}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink-800 truncate">
          {queue.customer_display_name}
        </p>
        {queue.catalog?.nama && (
          <p className="text-xs text-ink-400 truncate">
            {queue.catalog.nama}
          </p>
        )}
      </div>

      {/* Status */}
      <span
        className={cn(
          "flex-shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
          statusStyle,
        )}
      >
        {statusLabel}
      </span>
    </div>
  );
}   