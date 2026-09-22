import type { Kategori } from "./kategori";

export interface KategoriEmbed {
  id_kategori: number;
  nama: string;
  slug: string;
}

export interface PortfolioImage {
  id_portfolioImage: number;
  id_catalogItem: number;
  image_url: string;
  url: string;
  created_at: string;
}

export interface Catalog {
  id_catalogItem: number;
  nama: string;
  deskripsi: string | null;
  id_kategori: number;
  kategori: KategoriEmbed | null;
  price: number;
  price_max: number | null;
  cover_image: string | null;
  cover_url: string | null;
}

export interface CatalogDetail extends Catalog {
  status: number;
  created_at: string;
  updated_at: string;
  portfolio_images: PortfolioImage[];
}

// Re-export untuk memudahkan import.
export type { Kategori };