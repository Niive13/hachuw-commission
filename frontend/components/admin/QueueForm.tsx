"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { BffError } from "@/services/bff.service";
import { adminService } from "@/services/admin.service";
import { QUEUE_STATUS_LABEL } from "@/lib/queue-status";
import type { AdminQueue } from "@/types/admin-queue";
import type { AdminCatalog } from "@/types/admin-catalog";
import type { QueueStatus } from "@/types/queue";

const QUEUE_STATUSES: QueueStatus[] = [
  "WAITING",
  "SKETCH",
  "REVISION",
  "RENDERING",
  "COMPLETED",
  "CANCELLED",
];

interface QueueFormProps {
  initial?: AdminQueue;
  onSuccess: () => void;
  onCancel: () => void;
}

export function QueueForm({ initial, onSuccess, onCancel }: QueueFormProps) {
  const isEdit = Boolean(initial);

  const [catalogs, setCatalogs] = useState<AdminCatalog[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  const [customerName, setCustomerName] = useState(
    initial?.customer_display_name ?? "",
  );
  const [catalogId, setCatalogId] = useState(
    initial ? String(initial.id_catalogItem) : "",
  );
  const [queueStatus, setQueueStatus] = useState<QueueStatus>(
    initial?.queue_status ?? "WAITING",
  );
  const [orderDate, setOrderDate] = useState(
    initial?.order_date ?? new Date().toISOString().split("T")[0],
  );
  const [estimatedCompletion, setEstimatedCompletion] = useState(
    initial?.estimated_completion ?? "",
  );
  const [publicNote, setPublicNote] = useState(initial?.public_note ?? "");
  const [status, setStatus] = useState(initial?.status ?? 1);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch catalogs for dropdown
  useEffect(() => {
    let cancelled = false;
    adminService
      .getCatalogs()
      .then((data) => {
        if (cancelled) return;
        setCatalogs(data.filter((c) => c.status === 1)); // hanya yang aktif
        // Kalau create, auto-pilih yang pertama
        if (!isEdit && data.length > 0) {
          setCatalogId(String(data[0].id_catalogItem));
        }
      })
      .catch(() => {
        // silent
      })
      .finally(() => {
        if (!cancelled) setLoadingCatalogs(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isEdit]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        const payload = {
            customer_display_name: customerName.trim(),
            id_catalogItem: Number(catalogId),
            queue_status: queueStatus,
            order_date: orderDate,
            estimated_completion: estimatedCompletion.trim() === "" ? null : estimatedCompletion,
            public_note: publicNote.trim() === "" ? null : publicNote.trim(),
            status,
        };

      if (isEdit && initial) {
        await adminService.updateQueue(initial.id_queue, payload);
      } else {
        await adminService.createQueue(payload);
      }

      onSuccess();
    } catch (e) {
      if (e instanceof BffError) {
        if (e.errors) {
          const firstError = Object.values(e.errors)[0]?.[0];
          setError(firstError ?? e.message);
        } else {
          setError(e.message);
        }
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
        {!isEdit && (
        <div className="rounded-soft border border-lavender-200 bg-lavender-50 px-4 py-3 text-xs text-lavender-500">
            ℹ️ Nomor antrian akan di-assign otomatis (paling akhir).
        </div>
        )}
      {error && (
        <div className="rounded-soft border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-1">
        {/* Status */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Status Queue
          </span>
          <select
            value={queueStatus}
            onChange={(e) => setQueueStatus(e.target.value as QueueStatus)}
            disabled={loading}
            className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          >
            {QUEUE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {QUEUE_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Customer Name */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Nama Customer (display)
        </span>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          maxLength={100}
          disabled={loading}
          className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          placeholder="A-chan"
        />
      </label>

      {/* Catalog */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Catalog
        </span>
        <select
          value={catalogId}
          onChange={(e) => setCatalogId(e.target.value)}
          required
          disabled={loading || loadingCatalogs}
          className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100 disabled:opacity-60"
        >
          {loadingCatalogs ? (
            <option>Memuat catalog...</option>
          ) : catalogs.length === 0 ? (
            <option value="">Tidak ada catalog aktif</option>
          ) : (
            catalogs.map((c) => (
              <option key={c.id_catalogItem} value={c.id_catalogItem}>
                {c.nama} ({c.kategori?.nama ?? "—"})
              </option>
            ))
          )}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Order Date */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Tanggal Order
          </span>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            required
            disabled={loading}
            className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          />
        </label>

        {/* Estimated Completion */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Estimasi Selesai (opsional)
          </span>
          <input
            type="date"
            value={estimatedCompletion}
            onChange={(e) => setEstimatedCompletion(e.target.value)}
            disabled={loading}
            className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          />
        </label>
      </div>

      {/* Public Note */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Public Note (opsional)
        </span>
        <textarea
          value={publicNote}
          onChange={(e) => setPublicNote(e.target.value)}
          maxLength={1000}
          rows={3}
          disabled={loading}
          className="w-full resize-none rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          placeholder="Contoh: Karakter original, tema spring 🌸"
        />
        <p className="mt-1 text-xs text-ink-400">
          Note ini akan terlihat di public queue page.
        </p>
      </label>

      {/* Status Aktif */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Status Aktif
        </span>
        <select
          value={status}
          onChange={(e) => setStatus(Number(e.target.value))}
          disabled={loading}
          className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
        >
          <option value={1}>Aktif</option>
          <option value={0}>Nonaktif</option>
        </select>
      </label>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Queue"}
        </Button>
      </div>
    </form>
  );
}