import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/api";
import type { Artwork } from "@/types/artwork";

export const artworkService = {
  async getAll(): Promise<Artwork[]> {
    const res = await apiFetch<ApiResponse<Artwork[]>>("/artworks");
    return res.data;
  },
};