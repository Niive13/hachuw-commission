<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArtworkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_artwork' => $this->id_artwork,
            'urutan'     => $this->urutan,
            'image_url'  => $this->image_url,
            'url'        => $this->image_url
                ? asset('storage/' . $this->image_url)
                : null,
            'status'     => $this->status,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}