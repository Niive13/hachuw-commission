"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ImagePreviewModalProps {
  file: File | null;
  onConfirm: () => void;
  onCancel: () => void;
  uploading: boolean;
}

export function ImagePreviewModal({
  file,
  onConfirm,
  onCancel,
  uploading,
}: ImagePreviewModalProps) {
  const previewUrl = file ? URL.createObjectURL(file) : null;

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!file || !previewUrl) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-ink-900/60 p-4 backdrop-blur-sm"
      onClick={uploading ? undefined : onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-round border border-blush-100 bg-cream-50 p-5 shadow-hover"
      >
        <h3 className="font-display text-lg font-bold text-ink-800">
          Konfirmasi Upload
        </h3>
        <p className="mt-1 text-xs text-ink-400">
          {file.name} · {(file.size / 1024).toFixed(0)} KB
        </p>

        <div className="mt-4 overflow-hidden rounded-soft border border-blush-100 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-72 w-full object-contain"
          />
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={uploading}
          >
            Batal
          </Button>
          <Button type="button" onClick={onConfirm} disabled={uploading}>
            {uploading ? "Mengupload..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
}