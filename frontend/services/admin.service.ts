import { bffFetch } from "./bff.service";
import type { ApiResponse } from "@/types/api";
import type {
  AdminCatalog,
  AdminCatalogDetail,
  CatalogCreatePayload,
  CatalogUpdatePayload,
} from "@/types/admin-catalog";
import type {
  AdminQueue,
  QueueCreatePayload,
  QueueUpdatePayload,
} from "@/types/admin-queue";
import type { PortfolioImage } from "@/types/catalog";
import type {
  Kategori,
  KategoriCreatePayload,
  KategoriUpdatePayload,
} from "@/types/kategori";
import type { Artwork } from "@/types/artwork";

export const adminService = {
  // ============ DASHBOARD ============
  async getDashboard() {
    const res = await bffFetch<ApiResponse<{
      total_catalog: number;
      total_portfolio: number;
      total_queue_active: number;
      queue_waiting: number;
      queue_in_progress: number;
      queue_completed: number;
    }>>("/api/admin/dashboard", { method: "GET" });
    return res.data;
  },

    // ============ ARTWORKS ============
  async getArtworks(): Promise<Artwork[]> {
    const res = await bffFetch<ApiResponse<Artwork[]>>("/api/admin/artworks", {
      method: "GET",
    });
    return res.data;
  },

  async uploadArtworkImage(artworkId: number, file: File): Promise<Artwork> {
    const fd = new FormData();
    fd.append("image", file);

    const res = await bffFetch<ApiResponse<Artwork>>(
      `/api/admin/artworks/${artworkId}/image`,
      { method: "POST", body: fd },
    );
    return res.data;
  },

  async clearArtworkImage(artworkId: number): Promise<Artwork> {
    const res = await bffFetch<ApiResponse<Artwork>>(
      `/api/admin/artworks/${artworkId}/image`,
      { method: "DELETE" },
    );
    return res.data;
  },

    // ============ SETTINGS ============
  async getSettings(): Promise<{ key: string; value: string; description: string | null }[]> {
    const res = await bffFetch<ApiResponse<{ key: string; value: string; description: string | null }[]>>(
      "/api/admin/settings",
      { method: "GET" },
    );
    return res.data;
  },

  async updateSetting(key: string, value: string): Promise<void> {
    await bffFetch<ApiResponse<{ key: string; value: string }>>(
      "/api/admin/settings",
      {
        method: "PUT",
        body: JSON.stringify({ key, value }),
      },
    );
  },

    // ============ KATEGORI ============
  async getKategoris(): Promise<Kategori[]> {
    const res = await bffFetch<ApiResponse<Kategori[]>>("/api/admin/kategori", {
      method: "GET",
    });
    return res.data;
  },

  async createKategori(payload: KategoriCreatePayload): Promise<Kategori> {
    const res = await bffFetch<ApiResponse<Kategori>>("/api/admin/kategori", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateKategori(
    id: number,
    payload: KategoriUpdatePayload,
  ): Promise<Kategori> {
    const res = await bffFetch<ApiResponse<Kategori>>(`/api/admin/kategori/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async deleteKategori(id: number): Promise<void> {
    await bffFetch<ApiResponse<null>>(`/api/admin/kategori/${id}`, {
      method: "DELETE",
    });
  },

  // ============ CATALOG ============
  async getCatalogs(): Promise<AdminCatalog[]> {
    const res = await bffFetch<ApiResponse<AdminCatalog[]>>("/api/admin/catalog", { method: "GET" });
    return res.data;
  },

  async getCatalog(id: number): Promise<AdminCatalogDetail> {
    const res = await bffFetch<ApiResponse<AdminCatalogDetail>>(`/api/admin/catalog/${id}`, { method: "GET" });
    return res.data;
  },

    async createCatalog(payload: CatalogCreatePayload, coverFile?: File): Promise<AdminCatalog> {
    let body: BodyInit;

    if (coverFile) {
      const fd = new FormData();
      fd.append("nama", payload.nama);
      fd.append("id_kategori", String(payload.id_kategori));
      fd.append("price", String(payload.price));
      if (payload.price_max !== undefined && payload.price_max !== null) {
        fd.append("price_max", String(payload.price_max));
      }
      if (payload.status !== undefined) fd.append("status", String(payload.status));
      fd.append("cover_image", coverFile);
      body = fd;
    } else {
      body = JSON.stringify(payload);
    }

    const res = await bffFetch<ApiResponse<AdminCatalog>>("/api/admin/catalog", {
      method: "POST",
      body,
    });
    return res.data;
  },

  async updateCatalog(
    id: number,
    payload: CatalogUpdatePayload,
    coverFile?: File,
  ): Promise<AdminCatalogDetail> {
    let body: BodyInit;

    if (coverFile) {
      const fd = new FormData();
      if (payload.nama !== undefined) fd.append("nama", payload.nama);
      if (payload.id_kategori !== undefined) fd.append("id_kategori", String(payload.id_kategori));
      if (payload.price !== undefined) fd.append("price", String(payload.price));
      if (payload.price_max !== undefined && payload.price_max !== null) {
        fd.append("price_max", String(payload.price_max));
      }
      if (payload.status !== undefined) fd.append("status", String(payload.status));
      fd.append("cover_image", coverFile);
      body = fd;
    } else {
      body = JSON.stringify(payload);
    }

    const res = await bffFetch<ApiResponse<AdminCatalogDetail>>(`/api/admin/catalog/${id}`, {
      method: "PUT",
      body,
    });
    return res.data;
  },

  async deleteCatalog(id: number): Promise<void> {
    await bffFetch<ApiResponse<null>>(`/api/admin/catalog/${id}`, { method: "DELETE" });
  },

  // ============ PORTFOLIO IMAGES ============
  async uploadPortfolioImage(catalogId: number, file: File): Promise<PortfolioImage> {
    const fd = new FormData();
    fd.append("image", file);

    const res = await bffFetch<ApiResponse<PortfolioImage>>(
      `/api/admin/catalog/${catalogId}/images`,
      { method: "POST", body: fd },
    );
    return res.data;
  },

  async deletePortfolioImage(imageId: number): Promise<void> {
    await bffFetch<ApiResponse<null>>(`/api/admin/portfolio/${imageId}`, { method: "DELETE" });
  },

  // ============ QUEUE ============
  async getQueues(): Promise<AdminQueue[]> {
    const res = await bffFetch<ApiResponse<AdminQueue[]>>("/api/admin/queue", { method: "GET" });
    return res.data;
  },

  async createQueue(payload: QueueCreatePayload): Promise<AdminQueue> {
    const res = await bffFetch<ApiResponse<AdminQueue>>("/api/admin/queue", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async updateQueue(id: number, payload: QueueUpdatePayload): Promise<AdminQueue> {
    const res = await bffFetch<ApiResponse<AdminQueue>>(`/api/admin/queue/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async reorderQueues(orderedIds: number[]): Promise<void> {
    await bffFetch<ApiResponse<null>>("/api/admin/queue/reorder", {
      method: "PUT",
      body: JSON.stringify({ ids: orderedIds }),
    });
  },

  async deleteQueue(id: number): Promise<void> {
    await bffFetch<ApiResponse<null>>(`/api/admin/queue/${id}`, { method: "DELETE" });
  },

  
};