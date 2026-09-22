import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Kategori } from "@/types/kategori";

export const kategoriService = {
  async getAll(): Promise<Kategori[]> {
    const res = await apiFetch<ApiResponse<Kategori[]>>("/kategori");
    return res.data;
  },
};