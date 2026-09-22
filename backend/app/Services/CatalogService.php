<?php

namespace App\Services;

use App\Models\CatalogItem;
use App\Services\ImageStorage\ImageStorageService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class CatalogService
{
    public function __construct(
        private readonly ImageStorageService $imageStorage
    ) {}

    // ============================================================
    // PUBLIC
    // ============================================================

    public function getPublicList(?string $kategoriSlug = null): Collection
    {
        $query = CatalogItem::query()
            ->active()
            ->with('kategori')
            ->orderBy('id_kategori')
            ->orderBy('id_catalogItem');

        if ($kategoriSlug) {
            $query->byKategoriSlug($kategoriSlug);
        }

        return $query->get();
    }

    public function getPublicDetail(int $id): ?CatalogItem
    {
        return CatalogItem::query()
            ->active()
            ->with([
                'kategori',
                'portfolioImages' => function ($q) {
                    $q->where('status', 1)->orderBy('id_portfolioImage');
                },
            ])
            ->find($id);
    }

    // ============================================================
    // ADMIN
    // ============================================================

    public function getAdminList(): Collection
    {
        return CatalogItem::query()
            ->with('kategori')
            ->withCount(['portfolioImages as portfolio_images_count' => function ($q) {
                $q->where('status', 1);
            }])
            ->orderBy('id_catalogItem', 'desc')
            ->get();
    }

    public function getAdminDetail(int $id): ?CatalogItem
    {
        return CatalogItem::query()
            ->with([
                'kategori',
                'portfolioImages' => function ($q) {
                    $q->where('status', 1)->orderBy('id_portfolioImage');
                },
            ])
            ->find($id);
    }

    public function create(array $data, ?UploadedFile $cover = null): CatalogItem
    {
        $payload = [
            'nama'        => $data['nama'],
            'deskripsi'   => $data['deskripsi'] ?? null,
            'id_kategori' => $data['id_kategori'],
            'price'       => $data['price'],
            'price_max'   => $data['price_max'] ?? null,
            'status'      => $data['status'] ?? 1,
        ];

        if ($cover) {
            $payload['cover_image'] = $this->imageStorage->store($cover, 'catalog-covers');
        }

        $catalog = CatalogItem::create($payload);

        return $catalog->fresh(['kategori']);
    }

    public function update(CatalogItem $catalog, array $data, ?UploadedFile $cover = null): CatalogItem
    {
        $payload = [];

        foreach (['nama', 'deskripsi', 'id_kategori', 'price', 'price_max', 'status'] as $field) {
            if (array_key_exists($field, $data)) {
                $payload[$field] = $data[$field];
            }
        }

        // Validasi manual price_max >= price.
        $newPrice = $payload['price'] ?? $catalog->price;
        $newPriceMax = array_key_exists('price_max', $payload)
            ? $payload['price_max']
            : $catalog->price_max;

        if ($newPriceMax !== null && (float) $newPriceMax < (float) $newPrice) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'price_max' => ['Harga max harus lebih besar atau sama dengan harga min.'],
            ]);
        }

        if ($cover) {
            $payload['cover_image'] = $this->imageStorage->replace(
                $cover,
                'catalog-covers',
                $catalog->cover_image ?? ''
            );
        }

        $catalog->update($payload);

        return $catalog->fresh(['kategori']);
    }

    public function softDelete(CatalogItem $catalog): bool
    {
        return $catalog->update(['status' => 0]);
    }

    // ============================================================
    // PORTFOLIO
    // ============================================================

    public function addPortfolioImage(CatalogItem $catalog, UploadedFile $file): \App\Models\PortfolioImage
    {
        $path = $this->imageStorage->store($file, 'portfolio-images');

        return $catalog->portfolioImages()->create([
            'image_url' => $path,
            'status'    => 1,
        ]);
    }

    public function softDeletePortfolioImage(\App\Models\PortfolioImage $image): bool
    {
        return $image->update(['status' => 0]);
    }
}