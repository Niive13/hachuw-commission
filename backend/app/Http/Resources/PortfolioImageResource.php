<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_portfolioImage' => $this->id_portfolioImage,
            'id_catalogItem'    => $this->id_catalogItem,
            'image_url'         => $this->image_url,
            'url'               => asset('storage/' . $this->image_url),
            'created_at'        => $this->created_at?->toIso8601String(),
        ];
    }
}