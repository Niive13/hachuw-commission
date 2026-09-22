"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ImageGridItem } from "@/components/admin/ImageGridItem";
import { ImageUploadSlot } from "@/components/admin/ImageUploadSlot";
import { ImagePreviewModal } from "@/components/admin/ImagePreviewModal";
import { Lightbox } from "@/components/admin/Lightbox";
import { CatalogForm } from "@/components/admin/CatalogForm";
import { formatRupiahRange } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/components/ui/Toast";
import { BffError } from "@/services/bff.service";
import type { AdminCatalogDetail } from "@/types/admin-catalog";

interface CatalogImageClientProps {
  catalogId: number;
}

export function CatalogImageClient({ catalogId }: CatalogImageClientProps) {
  const [catalog, setCatalog] = useState<AdminCatalogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload flow
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Lightbox
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Edit catalog modal
  const [editOpen, setEditOpen] = useState(false);

  // Delete confirm
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  const [deletingImage, setDeletingImage] = useState(false);

  const toast = useToast();

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getCatalog(catalogId);
      setCatalog(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, [catalogId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  async function handleConfirmUpload() {
    if (!pendingFile) return;
    setUploading(true);
    setUploadError(null);
    try {
      await adminService.uploadPortfolioImage(catalogId, pendingFile);
      setPendingFile(null);
      await fetchDetail();
    } catch (e) {
      if (e instanceof BffError) {
        toast.success("Gambar berhasil diupload.")
      } else {
        setUploadError("Gagal mengupload gambar.");
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage() {
    if (deleteImageId === null) return;
    setDeletingImage(true);
    try {
      await adminService.deletePortfolioImage(deleteImageId);
      setDeleteImageId(null);
      await fetchDetail();
    } catch (e) {
      toast.success("Catalog berhasil diperbarui.");
    } finally {
      setDeletingImage(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <LoadingState message="Memuat catalog..." />
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-round border border-danger/30 bg-danger/10 p-6 text-center">
          <p className="text-sm text-danger">{error ?? "Catalog tidak ditemukan."}</p>
          <Link
            href="/admin/catalog"
            className="mt-3 inline-block text-xs font-semibold text-blush-500 hover:underline"
          >
            ← Kembali ke Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Breadcrumb */}
      <Link
        href="/admin/catalog"
        className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-ink-400 hover:text-blush-500"
      >
        ← Kembali ke Catalog
      </Link>

      {/* Catalog Information */}
      <div className="rounded-round border border-blush-100 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink-800">
            Catalog Information
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            Edit Catalog
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-5 sm:flex-row">
          {/* Cover */}
          <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-soft border border-blush-100 bg-blush-50">
            {catalog.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={catalog.cover_url}
                alt={catalog.nama}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl text-blush-300">
                🌸
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div>
              <Badge variant="pink">{catalog.kategori?.nama ?? "—"}</Badge>
            </div>
            <h3 className="font-display text-2xl font-bold text-ink-800">
              {catalog.nama}
            </h3>
            <p className="font-display text-lg font-bold text-blush-500">
              {formatRupiahRange(catalog.price, catalog.price_max)}
            </p>
            <div>
              {catalog.status === 1 ? (
                <Badge variant="success">Aktif</Badge>
              ) : (
                <Badge variant="danger">Nonaktif</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Images */}
      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-800">
              Portfolio Images
            </h2>
            <p className="mt-1 text-xs text-ink-400">
              {catalog.portfolio_images.length} gambar · Klik untuk preview, hover untuk hapus.
            </p>
          </div>
        </div>

        {catalog.portfolio_images.length === 0 && (
          <EmptyState
            title="Belum ada portfolio"
            description="Klik slot '+' di bawah untuk menambahkan gambar pertama."
            icon={<span className="text-4xl">🖼️</span>}
          />
        )}

        {uploadError && (
          <div className="mb-4 rounded-soft border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {uploadError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {catalog.portfolio_images.map((img) => (
            <ImageGridItem
              key={img.id_portfolioImage}
              image={img}
              onPreview={(url) => setPreviewUrl(url)}
              onDelete={() => setDeleteImageId(img.id_portfolioImage)}
            />
          ))}

          {/* Upload slot */}
          <ImageUploadSlot
            onFileSelected={(file) => setPendingFile(file)}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Preview Modal (before upload) */}
      <ImagePreviewModal
        file={pendingFile}
        onConfirm={handleConfirmUpload}
        onCancel={() => {
          if (!uploading) {
            setPendingFile(null);
            setUploadError(null);
          }
        }}
        uploading={uploading}
      />

      {/* Lightbox */}
      <Lightbox url={previewUrl} onClose={() => setPreviewUrl(null)} />

      {/* Edit Catalog Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Catalog"
      >
        <CatalogForm
          initial={catalog}
          onSuccess={() => {
            setEditOpen(false);
            fetchDetail();
          }}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      {/* Delete Image Confirm */}
      <Modal
        open={deleteImageId !== null}
        onClose={() => setDeleteImageId(null)}
        title="Hapus Gambar?"
        maxWidth="sm"
      >
        <p className="text-sm text-ink-600">
          Yakin ingin menghapus gambar ini? Gambar akan di-soft-delete dan
          tidak muncul di public site.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setDeleteImageId(null)}
            disabled={deletingImage}
          >
            Batal
          </Button>
          <Button
            onClick={handleDeleteImage}
            disabled={deletingImage}
            className="bg-danger hover:bg-danger/90"
          >
            {deletingImage ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}