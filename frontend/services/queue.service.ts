import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/api";
import type { PublicQueueResponse } from "@/types/queue";

export const queueService = {
  async getAll(): Promise<PublicQueueResponse> {
    const res = await apiFetch<ApiResponse<PublicQueueResponse>>("/queue");
    return res.data;
  },
};