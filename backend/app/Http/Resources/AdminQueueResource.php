<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminQueueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_queue'              => $this->id_queue,
            'queue_number'          => $this->queue_number,
            'customer_display_name' => $this->customer_display_name,
            'id_catalogItem'        => $this->id_catalogItem,
            'queue_status'          => $this->queue_status,
            'order_date'            => $this->order_date?->format('Y-m-d'),
            'estimated_completion'  => $this->estimated_completion?->format('Y-m-d'),
            'public_note'           => $this->public_note,
            'status'                => $this->status,
            'created_at'            => $this->created_at?->toIso8601String(),
            'updated_at'            => $this->updated_at?->toIso8601String(),
            'catalog' => $this->whenLoaded('catalogItem', fn () => [
                'id_catalogItem' => $this->catalogItem->id_catalogItem,
                'nama'           => $this->catalogItem->nama,
                'kategori'       => $this->catalogItem->relationLoaded('kategori') && $this->catalogItem->kategori
                    ? [
                        'id_kategori' => $this->catalogItem->kategori->id_kategori,
                        'nama'        => $this->catalogItem->kategori->nama,
                        'slug'        => $this->catalogItem->kategori->slug,
                    ]
                    : null,
            ]),
        ];
    }
}