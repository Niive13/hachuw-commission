"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { CatalogForm } from "@/components/admin/CatalogForm";
import { formatRupiahRange } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/components/ui/Toast";
import type { AdminCatalog } from "@/types/admin-catalog";

export function CatalogAdminClient() {
  const [catalogs, setCatalogs] = useState<AdminCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCatalog | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCatalog | null>(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getCatalogs();
      setCatalogs(data);
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
      await adminService.deleteCatalog(deleteTarget.id_catalogItem);
      toast.success(`Catalog "${deleteTarget.nama}" berhasil dinonaktifkan.`);
      setDeleteTarget(null);
      await fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<AdminCatalog>[] = [
    {
      key: "cover",
      label: "",
      className: "w-20",
      render: (row) =>
        row.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.cover_url}
            alt={row.nama}
            className="h-12 w-12 rounded-soft object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-soft bg-blush-50 text-lg">
            🌸
          </div>
        ),
    },
    {
      key: "nama",
      label: "Nama",
      render: (row) => (
        <div>
          <p className="font-semibold text-ink-800">{row.nama}</p>
          <p className="text-xs text-ink-400">
            {row.portfolio_count ?? 0} portfolio image
          </p>
        </div>
      ),
    },
    {
      key: "kategori",
      label: "Kategori",
      render: (row) => <Badge variant="pink">{row.kategori?.nama ?? "—"}</Badge>,
    },
    {
      key: "price",
      label: "Harga",
      render: (row) => (
        <span className="font-semibold text-blush-500">
          {formatRupiahRange(row.price, row.price_max)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
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
      className: "w-48",
      render: (row) => (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/admin/catalog/${row.id_catalogItem}`}
            className="rounded-soft px-2 py-1 text-xs font-semibold text-lavender-500 hover:bg-lavender-50"
          >
            Images
          </Link>
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
            Catalog
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            Kelola daftar commission yang kamu tawarkan.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Tambah Catalog</Button>
      </div>

      <DataTable
        columns={columns}
        data={catalogs}
        loading={loading}
        error={error}
        rowKey={(row) => row.id_catalogItem}
        emptyTitle="Belum ada catalog"
        emptyDescription="Klik 'Tambah Catalog' untuk memulai."
      />

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tambah Catalog"
      >
        <CatalogForm
          onSuccess={() => {
            setCreateOpen(false);
            toast.success("Catalog berhasil dibuat.");
            fetchData();
          }}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title={`Edit: ${editTarget?.nama ?? ""}`}
      >
        {editTarget && (
          <CatalogForm
            initial={editTarget}
            onSuccess={() => {
              setEditTarget(null);
              toast.success("Catalog berhasil diperbarui.");
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
        title="Hapus Catalog?"
        maxWidth="sm"
      >
        <p className="text-sm text-ink-600">
          Yakin ingin menghapus <strong>{deleteTarget?.nama}</strong>? Catalog
          tidak akan muncul di public site. Aksi ini tidak permanen — kamu bisa
          aktifkan kembali dari form edit.
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