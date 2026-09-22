"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { KategoriForm } from "@/components/admin/KategoriForm";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/components/ui/Toast";
import type { Kategori } from "@/types/kategori";

export function KategoriAdminClient() {
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Kategori | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Kategori | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activatingId, setActivatingId] = useState<number | null>(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getKategoris();
      setKategoris(data);
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
      await adminService.deleteKategori(deleteTarget.id_kategori);
      setDeleteTarget(null);
      toast.success(`Kategori "${deleteTarget.nama}" berhasil dinonaktifkan.`);
      await fetchData();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal menghapus.";
      toast.error(msg);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

    async function handleActivate(kategori: Kategori) {
    setActivatingId(kategori.id_kategori);
    try {
      await adminService.updateKategori(kategori.id_kategori, { status: 1 });
      toast.success(`Kategori "${kategori.nama}" berhasil diaktifkan.`);
      await fetchData();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Gagal mengaktifkan.";
      toast.error(msg);
    } finally {
      setActivatingId(null);
    }
  }

  const columns: Column<Kategori>[] = [
    {
      key: "urutan",
      label: "Urutan",
      className: "w-20",
      render: (row) => (
        <span className="font-display text-lg font-bold text-blush-400">
          {row.urutan}
        </span>
      ),
    },
    {
      key: "nama",
      label: "Nama",
      render: (row) => (
        <div>
          <p
            className={cn(
              "font-semibold",
              row.status === 1 ? "text-ink-800" : "text-ink-400 line-through",
            )}
          >
            {row.nama}
          </p>
          <p className="mt-0.5 font-mono text-xs text-ink-400">{row.slug}</p>
        </div>
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
      className: "w-56",
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.status === 0 && (
            <button
              type="button"
              onClick={() => handleActivate(row)}
              disabled={activatingId === row.id_kategori}
              className="rounded-soft px-2 py-1 text-xs font-semibold text-success hover:bg-success/10 disabled:opacity-50"
            >
              {activatingId === row.id_kategori ? "..." : "Aktifkan"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditTarget(row)}
            className="rounded-soft px-2 py-1 text-xs font-semibold text-blush-500 hover:bg-blush-50"
          >
            Edit
          </button>
          {row.status === 1 && (
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              className="rounded-soft px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
            >
              Hapus
            </button>
          )}
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
            Kategori
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            Kelola jenis kategori commission yang kamu tawarkan.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ Tambah Kategori</Button>
      </div>

      <DataTable
        columns={columns}
        data={kategoris}
        loading={loading}
        error={error}
        rowKey={(row) => row.id_kategori}
        emptyTitle="Belum ada kategori"
        emptyDescription="Klik 'Tambah Kategori' untuk memulai."
      />

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Tambah Kategori"
      >
        <KategoriForm
          onSuccess={() => {
            setCreateOpen(false);
            toast.success("Kategori berhasil dibuat.");
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
        <KategoriForm
            initial={editTarget}
            onSuccess={() => {
              setEditTarget(null);
              toast.success("Kategori berhasil diperbarui.");
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
        title="Nonaktifkan Kategori?"
        maxWidth="sm"
      >
        <p className="text-sm text-ink-600">
          Yakin ingin menonaktifkan kategori{" "}
          <strong>{deleteTarget?.nama}</strong>? Kategori tidak akan muncul
          di public site. Kamu bisa aktifkan kembali dengan tombol{" "}
          <strong>Aktifkan</strong>.
        </p>
        <p className="mt-3 rounded-soft bg-warning/10 px-3 py-2 text-xs text-ink-500">
          ℹ️ Kategori yang masih dipakai catalog <strong>tidak bisa</strong>{" "}
          dihapus. Pindahkan catalog ke kategori lain dulu.
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
            {deleting ? "Memproses..." : "Ya, Nonaktifkan"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}