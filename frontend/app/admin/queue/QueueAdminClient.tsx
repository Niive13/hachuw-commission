"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { QueueForm } from "@/components/admin/QueueForm";
import { cn } from "@/lib/utils";
import {
  QUEUE_STATUS_LABEL,
  QUEUE_STATUS_STYLE,
} from "@/lib/queue-status";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/components/ui/Toast";
import type { AdminQueue } from "@/types/admin-queue";
import { ReorderableQueueList } from "@/components/admin/ReorderableQueueList";

export function QueueAdminClient() {
  const [queues, setQueues] = useState<AdminQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminQueue | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminQueue | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const toast = useToast();
    // Queue aktif = WAITING, SKETCH, REVISION, RENDERING.
  const activeQueues = queues.filter((q) =>
    ["WAITING", "SKETCH", "REVISION", "RENDERING"].includes(q.queue_status),
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getQueues();
      setQueues(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteQueue(deleteTarget.id_queue);
      setDeleteTarget(null);
      await fetchData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSaveOrder(orderedIds: number[]) {
    setSavingOrder(true);
    try {
      await adminService.reorderQueues(orderedIds);
      toast.success("Urutan queue berhasil disimpan.");
      setReorderMode(false);
      await fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan urutan.");
    } finally {
      setSavingOrder(false);
    }
  }

  const columns: Column<AdminQueue>[] = [
    {
      key: "queue_number",
      label: "#",
      className: "w-16",
      render: (row) => (
        <span className="font-display text-xl font-bold text-blush-400">
          {String(row.queue_number).padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "customer_display_name",
      label: "Customer",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink-800">
            {row.customer_display_name}
          </p>
          {row.catalog?.nama && (
            <p className="text-xs text-ink-400">{row.catalog.nama}</p>
          )}
        </div>
      ),
    },
    {
      key: "queue_status",
      label: "Status",
      render: (row) => (
        <span
          className={cn(
            "inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            QUEUE_STATUS_STYLE[row.queue_status],
          )}
        >
          {QUEUE_STATUS_LABEL[row.queue_status]}
        </span>
      ),
    },
    {
      key: "order_date",
      label: "Order",
      render: (row) => (
        <span className="text-xs text-ink-500">
          {row.order_date
            ? new Date(row.order_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      key: "estimated_completion",
      label: "Est. Selesai",
      render: (row) => (
        <span className="text-xs text-ink-500">
          {row.estimated_completion
            ? new Date(row.estimated_completion).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Aktif",
      render: (row) =>
        row.status === 1 ? (
          <Badge variant="success">Aktif</Badge>
        ) : (
          <Badge variant="danger">Nonaktif</Badge>
        ),
    },
    {
      key: "actions",
      label: "Aksi",
      className: "w-32",
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditTarget(row)}
            className="rounded-soft px-2 py-1 text-xs font-semibold text-blush-500 hover:bg-blush-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="rounded-soft px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
          >
            Hapus
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-800">
            Queue
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            Kelola antrian commission. Hanya data aktif yang tampil di public.
          </p>
        </div>
        <div className="flex gap-2">
          {!reorderMode && activeQueues.length > 1 && (
            <Button variant="outline" onClick={() => setReorderMode(true)}>
              ⇅ Reorder
            </Button>
          )}
          <Button onClick={() => setCreateOpen(true)}>+ Tambah Queue</Button>
        </div>
      </div>

      {reorderMode ? (
        <div className="rounded-round border border-blush-100 bg-cream-50 p-4 sm:p-6">
          <ReorderableQueueList
            queues={activeQueues}
            onSave={handleSaveOrder}
            onCancel={() => setReorderMode(false)}
            saving={savingOrder}
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={queues}
          loading={loading}
          error={error}
          rowKey={(row) => row.id_queue}
          emptyTitle="Belum ada queue"
          emptyDescription="Klik 'Tambah Queue' untuk memulai."
        />
      )}

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tambah Queue"
        maxWidth="lg"
      >
        <QueueForm
          onSuccess={() => {
            setCreateOpen(false);
            toast.success("Queue berhasil dibuat.");
            fetchData();
          }}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title={`Edit Queue #${editTarget?.queue_number ?? ""}`}
        maxWidth="lg"
      >
        {editTarget && (
          <QueueForm
            initial={editTarget}
            onSuccess={() => {
              setEditTarget(null);
              toast.success("Queue berhasil diedit.");
              fetchData();
            }}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Queue?"
        maxWidth="sm"
      >
        <p className="text-sm text-ink-600">
          Yakin ingin menghapus queue <strong>{deleteTarget?.customer_display_name}</strong>? Queue akan di-soft-delete dan tidak muncul di public site.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-danger hover:bg-danger/90"
          >
            {deleting ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}