import type { KategoriEmbed, PortfolioImage } from "./catalog";

export interface AdminCatalog {
  id_catalogItem: number;
  nama: string;
  deskripsi: string | null;
  id_kategori: number;
  kategori: KategoriEmbed | null;
  price: number;
  price_max: number | null;
  status: number;
  cover_image: string | null;
  cover_url: string | null;
  portfolio_count?: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminCatalogDetail extends AdminCatalog {
  portfolio_images: PortfolioImage[];
}

export interface CatalogCreatePayload {
  nama: string;
  deskripsi?: string | null;   // ← tambah
  id_kategori: number;
  price: number;
  price_max?: number | null;
  status?: number;
}

export interface CatalogUpdatePayload {
  nama?: string;
  deskripsi?: string | null;
  id_kategori?: number;
  price?: number;
  price_max?: number | null;
  status?: number;
}