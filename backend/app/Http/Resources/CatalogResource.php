<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CatalogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_catalogItem' => $this->id_catalogItem,
            'nama'           => $this->nama,
            'deskripsi'      => $this->deskripsi,     
            'id_kategori'    => $this->id_kategori,
            'kategori'       => $this->whenLoaded('kategori', fn () => [
                'id_kategori' => $this->kategori->id_kategori,
                'nama'        => $this->kategori->nama,
                'slug'        => $this->kategori->slug,
            ]),
            'price'          => (float) $this->price,
            'price_max'      => $this->price_max !== null ? (float) $this->price_max : null,
            'cover_image'    => $this->cover_image,
            'cover_url'      => $this->cover_image
                ? asset('storage/' . $this->cover_image)
                : null,
        ];
    }
}