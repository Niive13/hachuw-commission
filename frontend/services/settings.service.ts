import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/api";

export type CommissionStatus = "open" | "closed";

export interface PublicSettings {
  commission_status: CommissionStatus;
}

export const settingsService = {
  async getPublic(): Promise<PublicSettings> {
    const res = await apiFetch<ApiResponse<PublicSettings>>("/settings");
    return res.data;
  },
};