<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminCatalogDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_catalogItem' => $this->id_catalogItem,
            'nama'           => $this->nama,
            'deskripsi'      => $this->deskripsi,     // ← tambah
            'id_kategori'    => $this->id_kategori,
            'kategori'       => $this->whenLoaded('kategori', fn () => [
                'id_kategori' => $this->kategori->id_kategori,
                'nama'        => $this->kategori->nama,
                'slug'        => $this->kategori->slug,
            ]),
            'price'          => (float) $this->price,
            'price_max'      => $this->price_max !== null ? (float) $this->price_max : null,
            'status'         => $this->status,
            'cover_image'    => $this->cover_image,
            'cover_url'      => $this->cover_image
                ? asset('storage/' . $this->cover_image)
                : null,
            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
            'portfolio_images' => PortfolioImageResource::collection(
                $this->whenLoaded('portfolioImages')
            ),
        ];
    }
}