"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { BffError } from "@/services/bff.service";
import { adminService } from "@/services/admin.service";
import type {
  AdminCatalog,
  CatalogCreatePayload,
} from "@/types/admin-catalog";
import type { Kategori } from "@/types/kategori";

interface CatalogFormProps {
  initial?: AdminCatalog;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CatalogForm({ initial, onSuccess, onCancel }: CatalogFormProps) {
  const isEdit = Boolean(initial);

  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [loadingKategoris, setLoadingKategoris] = useState(true);

  const [idKategori, setIdKategori] = useState<number | "">(initial?.id_kategori ?? "");
  const [nama, setNama] = useState(initial?.nama ?? "");
  const [deskripsi, setDeskripsi] = useState(initial?.deskripsi ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [priceMax, setPriceMax] = useState(
    initial?.price_max !== null && initial?.price_max !== undefined
      ? String(initial.price_max)
      : "",
  );
  const [status, setStatus] = useState(initial?.status ?? 1);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch kategori list
  useEffect(() => {
    let cancelled = false;
    adminService
      .getKategoris()
      .then((data) => {
        if (cancelled) return;
        setKategoris(data.filter((k) => k.status === 1));
        if (!isEdit && data.length > 0 && idKategori === "") {
          setIdKategori(data[0].id_kategori);
        }
      })
      .catch(() => {
        // silent
      })
      .finally(() => {
        if (!cancelled) setLoadingKategoris(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    } else {
      setCoverPreview(null);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (idKategori === "") {
      setError("Kategori wajib dipilih.");
      return;
    }

    const priceNum = Number(price);
    const priceMaxNum = priceMax.trim() === "" ? null : Number(priceMax);

    if (priceMaxNum !== null && priceMaxNum < priceNum) {
      setError("Harga max harus lebih besar atau sama dengan harga min.");
      return;
    }

    setLoading(true);

    try {
      const payload: CatalogCreatePayload = {
        nama: nama.trim(),
        deskripsi: deskripsi.trim() === "" ? null : deskripsi.trim(),  // ← tambah
        id_kategori: Number(idKategori),
        price: priceNum,
        price_max: priceMaxNum,
        status,
      };

      if (isEdit && initial) {
        await adminService.updateCatalog(
          initial.id_catalogItem,
          payload,
          coverFile ?? undefined,
        );
      } else {
        await adminService.createCatalog(payload, coverFile ?? undefined);
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

      {/* Kategori */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Kategori
        </span>
        <select
          value={idKategori}
          onChange={(e) => setIdKategori(Number(e.target.value))}
          disabled={loading || loadingKategoris}
          required
          className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100 disabled:opacity-60"
        >
          {loadingKategoris ? (
            <option>Memuat kategori...</option>
          ) : kategoris.length === 0 ? (
            <option value="">Belum ada kategori</option>
          ) : (
            kategoris.map((k) => (
              <option key={k.id_kategori} value={k.id_kategori}>
                {k.nama}
              </option>
            ))
          )}
        </select>
        {kategoris.length === 0 && !loadingKategoris && (
          <p className="mt-1.5 text-xs text-danger">
            Belum ada kategori aktif. Tambah kategori dulu di menu Kategori.
          </p>
        )}
      </label>

      {/* Nama */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Nama
        </span>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
          maxLength={150}
          disabled={loading}
          className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          placeholder="Contoh: Headshot"
        />
      </label>

      {/* Deskripsi */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Deskripsi (opsional)
        </span>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          maxLength={2000}
          rows={4}
          disabled={loading}
          className="w-full resize-none rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
          placeholder="Contoh: Ilustrasi headshot dengan detail tinggi, cocok untuk avatar atau profile picture. Include file PNG resolusi tinggi."
        />
        <p className="mt-1 text-xs text-ink-400">
          Deskripsi ini akan tampil di modal catalog saat customer klik card.
        </p>
      </label>

      {/* Price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Harga Min (Rp)
          </span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            step="0.01"
            disabled={loading}
            className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
            placeholder="10000"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Harga Max (opsional)
          </span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            min={0}
            step="0.01"
            disabled={loading}
            className="w-full rounded-soft border border-blush-200 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none transition-colors focus:border-blush-400 focus:ring-4 focus:ring-blush-100"
            placeholder="Kosongkan jika harga tunggal"
          />
        </label>
      </div>

      <p className="-mt-3 text-xs text-ink-400">
        Kosongkan <strong>Harga Max</strong> kalau harga tunggal. Isi untuk
        tampilkan range, misal: <em>Rp 10.000 - Rp 30.000</em>.
      </p>

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

      {/* Cover Image */}
      <div>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Cover Image (opsional)
        </span>

        <div className="flex items-start gap-4">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-soft border-2 border-dashed border-blush-200 bg-cream-50">
            {coverPreview || initial?.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverPreview ?? initial?.cover_url ?? ""}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-blush-300">
                🖼️
              </div>
            )}
          </div>

          <div className="flex-1">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onFileChange}
              disabled={loading}
              className="block w-full text-xs text-ink-500 file:mr-3 file:rounded-full file:border-0 file:bg-blush-400 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-blush-500"
            />
            <p className="mt-1.5 text-xs text-ink-400">
              Max 5 MB · Format: JPG, PNG, WebP, GIF
            </p>
            {coverFile && (
              <button
                type="button"
                onClick={() => {
                  setCoverFile(null);
                  setCoverPreview(null);
                }}
                className="mt-2 text-xs text-danger hover:underline"
              >
                Hapus file terpilih
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Catalog"}
        </Button>
      </div>
    </form>
  );
}