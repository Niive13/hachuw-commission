import type { QueueStatus } from "./queue";

export interface AdminQueue {
  id_queue: number;
  queue_number: number;
  customer_display_name: string;
  id_catalogItem: number;
  queue_status: QueueStatus;
  order_date: string | null;
  estimated_completion: string | null;
  public_note: string | null;
  status: number;
  created_at: string | null;
  updated_at: string | null;
  catalog?: {
    id_catalogItem: number;
    nama: string;
    kategori?: {
      id_kategori: number;
      nama: string;
      slug: string;
    } | null;
  };
}

export interface QueueCreatePayload {
  customer_display_name: string;
  id_catalogItem: number;
  queue_status: QueueStatus;
  order_date: string;
  estimated_completion?: string | null;
  public_note?: string | null;
  status?: number;
}

export interface QueueUpdatePayload {
  customer_display_name?: string;
  id_catalogItem?: number;
  queue_status?: QueueStatus;
  order_date?: string;
  estimated_completion?: string | null;
  public_note?: string | null;
  status?: number;
}