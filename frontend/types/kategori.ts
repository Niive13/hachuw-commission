export interface Kategori {
  id_kategori: number;
  nama: string;
  slug: string;
  urutan: number;
  status?: number;
}

export interface KategoriCreatePayload {
  nama: string;
  slug: string;
  urutan?: number;
  status?: number;
}

export interface KategoriUpdatePayload {
  nama?: string;
  slug?: string;
  urutan?: number;
  status?: number;
}