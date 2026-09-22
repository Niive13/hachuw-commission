"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { adminService } from "@/services/admin.service";
import type { Artwork } from "@/types/artwork";

export function ArtworkAdminClient() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Artwork | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getArtworks();
      setArtworks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleUpload(artwork: Artwork, file: File) {
    setUploadingId(artwork.id_artwork);
    try {
      await adminService.uploadArtworkImage(artwork.id_artwork, file);
      toast.success(`Artwork slot #${artwork.urutan} berhasil diupload.`);
      await fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengupload.");
    } finally {
      setUploadingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.clearArtworkImage(deleteTarget.id_artwork);
      toast.success(`Artwork slot #${deleteTarget.urutan} berhasil dikosongkan.`);
      setDeleteTarget(null);
      await fetchData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menghapus.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-ink-800">
          Artwork Marquee
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Kelola 8 gambar yang tampil di marquee landing page. Format bebas:
          PNG atau GIF. Ukuran maksimal 5 MB.
        </p>
      </div>

      {loading && <LoadingState message="Memuat artwork..." />}

      {error && (
        <div className="rounded-round border border-danger/30 bg-danger/10 p-6 text-center">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {artworks.map((artwork) => (
              <ArtworkSlot
                key={artwork.id_artwork}
                artwork={artwork}
                uploading={uploadingId === artwork.id_artwork}
                onUpload={(file) => handleUpload(artwork, file)}
                onDelete={() => setDeleteTarget(artwork)}
                onPreview={() => artwork.url && setPreviewUrl(artwork.url)}
              />
            ))}
          </div>

          <div className="mt-6 rounded-soft border border-lavender-200 bg-lavender-50 p-4 text-sm text-ink-600">
            ℹ️ <strong>{artworks.filter((a) => a.image_url).length} dari 8</strong>{" "}
            slot terisi. Slot kosong tidak akan muncul di marquee public.
          </div>
        </>
      )}

      {/* Delete Confirm */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Kosongkan Slot?"
        maxWidth="sm"
      >
        <p className="text-sm text-ink-600">
          Yakin ingin mengosongkan slot <strong>#{deleteTarget?.urutan}</strong>?
          Gambar akan dihapus dari marquee public.
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
            {deleting ? "Memproses..." : "Ya, Kosongkan"}
          </Button>
        </div>
      </Modal>

      {/* Lightbox Preview */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-900/85 p-4 backdrop-blur-sm"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-600 hover:bg-white"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-[90vw]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[90vh] max-w-[90vw] rounded-soft object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ARTWORK SLOT
// ============================================================

interface ArtworkSlotProps {
  artwork: Artwork;
  uploading: boolean;
  onUpload: (file: File) => void;
  onDelete: () => void;
  onPreview: () => void;
}

function ArtworkSlot({
  artwork,
  uploading,
  onUpload,
  onDelete,
  onPreview,
}: ArtworkSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hovering, setHovering] = useState(false);

  function handleClick() {
    if (!uploading) inputRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Slot Label */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          Slot #{artwork.urutan}
        </span>
        {artwork.image_url && (
          <span className="text-[10px] font-semibold text-success">
            ● Terisi
          </span>
        )}
      </div>

      {/* Slot Box */}
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="group relative aspect-square overflow-hidden rounded-round border border-blush-100 bg-cream-50 shadow-soft transition-all hover:shadow-card"
      >
        {uploading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blush-200 border-t-blush-500" />
          </div>
        ) : artwork.url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.url}
              alt={`Artwork ${artwork.urutan}`}
              className="h-full w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-105"
              onClick={onPreview}
            />

            {/* Overlay on hover */}
            {hovering && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  aria-label="Hapus"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-danger text-white shadow-card transition-transform hover:scale-110"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>

                {/* Replace button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-700 shadow-card hover:bg-white"
                >
                  Ganti
                </button>
              </>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-400 transition-colors hover:bg-blush-50 hover:text-blush-500"
          >
            <span className="text-4xl">+</span>
            <span className="text-xs font-semibold">Upload</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}