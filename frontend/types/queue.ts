export type QueueStatus =
  | "WAITING"
  | "SKETCH"
  | "REVISION"
  | "RENDERING"
  | "COMPLETED"
  | "CANCELLED";

export interface QueueCatalogEmbed {
  id_catalogItem?: number;
  nama?: string;
  kategori?: {
    id_kategori: number;
    nama: string;
    slug: string;
  } | null;
}

export interface QueueItem {
  id_queue: number;
  queue_number: number;
  queue_number_formatted: string;
  customer_display_name: string;
  queue_status: QueueStatus;
  order_date: string | null;
  estimated_completion: string | null;
  public_note: string | null;
  catalog: QueueCatalogEmbed;
}

export interface PublicQueueResponse {
  active: QueueItem[];
  completed: QueueItem[];
}