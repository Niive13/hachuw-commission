<?php

namespace App\Services;

use App\Models\Artwork;
use App\Services\ImageStorage\ImageStorageService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class ArtworkService
{
    public function __construct(
        private readonly ImageStorageService $imageStorage
    ) {}

    /**
     * Public list: hanya slot yang punya image.
     */
    public function getPublicList(): Collection
    {
        return Artwork::query()
            ->active()
            ->whereNotNull('image_url')
            ->where('image_url', '!=', '')
            ->ordered()
            ->get();
    }

    /**
     * Admin list: semua slot (termasuk kosong).
     */
    public function getAdminList(): Collection
    {
        return Artwork::query()->ordered()->get();
    }

    /**
     * Upload/replace image untuk slot tertentu (berdasarkan id_artwork).
     */
    public function updateImage(Artwork $artwork, UploadedFile $file): Artwork
    {
        // Replace: hapus file lama (kalau ada), simpan baru.
        $newPath = $this->imageStorage->replace(
            $file,
            'artworks',
            $artwork->image_url ?? ''
        );

        $artwork->update(['image_url' => $newPath]);

        return $artwork->fresh();
    }

    /**
     * Hapus image dari slot (kosongkan slot).
     */
    public function clearImage(Artwork $artwork): Artwork
    {
        if ($artwork->image_url) {
            $this->imageStorage->delete($artwork->image_url);
        }

        $artwork->update(['image_url' => null]);

        return $artwork->fresh();
    }
}