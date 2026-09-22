"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { BffError } from "@/services/bff.service";
import { adminService } from "@/services/admin.service";
import type {
  Kategori,
  KategoriCreatePayload,
} from "@/types/kategori";

interface KategoriFormProps {
  initial?: Kategori;
  onSuccess: () => void;
  onCancel: () => void;
}

export function KategoriForm({ initial, onSuccess, onCancel }: KategoriFormProps) {
  const isEdit = Boolean(initial);

  const [nama, setNama] = useState(initial?.nama ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [urutan, setUrutan] = useState(initial ? String(initial.urutan) : "0");
  const [status, setStatus] = useState(initial?.status ?? 1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-generate slug dari nama (kalau belum di-edit manual).
  function handleNamaChange(value: string) {
    setNama(value);
    if (!isEdit) {
      const generated = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s_-]/g, "")
        .replace(/\s+/g, "_")
        .replace(/_+/g, "_");
      setSlug(generated);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: KategoriCreatePayload = {
        nama: nama.trim(),
        slug: slug.trim(),
        urutan: Number(urutan),
        status,
      };

      if (isEdit && initial) {
        await adminService.updateKategori(initial.id_kategori, payload);
      } else {
        await adminService.createKategori(payload);
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
      {error && (
        <div className="rounded-soft border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Nama */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Nama Kategori
        </span>
        <input
          type="text"
          value={nama}
          onChange={(e) => handleNamaChange(e.target.value)}
          required
          maxLength={50}
          disabled={loading}
          className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          placeholder="Contoh: Illustration"
        />
      </label>

      {/* Slug */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Slug
        </span>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          maxLength={50}
          pattern="[a-z0-9_]+"
          disabled={loading}
          className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          placeholder="illustration"
        />
        <p className="mt-1 text-xs text-ink-400">
          Huruf kecil, angka, dan underscore. Contoh: <em>custom_emote</em>
        </p>
      </label>

      {/* Urutan */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Urutan Tampil
        </span>
        <input
          type="number"
          value={urutan}
          onChange={(e) => setUrutan(e.target.value)}
          min={0}
          disabled={loading}
          className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          placeholder="0"
        />
        <p className="mt-1 text-xs text-ink-400">
          Semakin kecil, semakin awal muncul di filter tabs.
        </p>
      </label>

      {/* Status */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Status
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
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
        </Button>
      </div>
    </form>
  );
}