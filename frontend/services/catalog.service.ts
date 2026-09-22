import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Catalog, CatalogDetail } from "@/types/catalog";

export const catalogService = {
  async getAll(kategoriSlug?: string): Promise<Catalog[]> {
    const query = kategoriSlug ? `?kategori=${kategoriSlug}` : "";
    const res = await apiFetch<ApiResponse<Catalog[]>>(`/catalog${query}`);
    return res.data;
  },

  async getDetail(id: number): Promise<CatalogDetail> {
    const res = await apiFetch<ApiResponse<CatalogDetail>>(`/catalog/${id}`);
    return res.data;
  },
};