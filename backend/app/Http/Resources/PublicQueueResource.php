<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicQueueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_queue'                => $this->id_queue,
            'queue_number'            => $this->queue_number,
            'queue_number_formatted'  => str_pad((string) $this->queue_number, 2, '0', STR_PAD_LEFT),
            'customer_display_name'   => $this->customer_display_name,
            'queue_status'            => $this->queue_status,
            'order_date'              => $this->order_date?->format('Y-m-d'),
            'estimated_completion'    => $this->estimated_completion?->format('Y-m-d'),
            'public_note'             => $this->public_note,

            'catalog' => [
                'id_catalogItem' => $this->whenLoaded('catalogItem', fn () => $this->catalogItem->id_catalogItem),
                'nama'           => $this->whenLoaded('catalogItem', fn () => $this->catalogItem->nama),
                'kategori'       => $this->whenLoaded('catalogItem', fn () => $this->catalogItem->relationLoaded('kategori') && $this->catalogItem->kategori
                    ? [
                        'id_kategori' => $this->catalogItem->kategori->id_kategori,
                        'nama'        => $this->catalogItem->kategori->nama,
                        'slug'        => $this->catalogItem->kategori->slug,
                    ]
                    : null
                ),
            ],
        ];
    }
}