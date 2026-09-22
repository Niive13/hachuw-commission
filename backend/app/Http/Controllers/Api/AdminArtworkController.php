<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Artwork\StoreArtworkImageRequest;
use App\Http\Resources\ArtworkResource;
use App\Models\Artwork;
use App\Services\ArtworkService;
use Illuminate\Http\JsonResponse;

class AdminArtworkController extends Controller
{
    public function __construct(
        private readonly ArtworkService $artworkService
    ) {}

    /**
     * List semua 8 slot.
     */
    public function index(): JsonResponse
    {
        $artworks = $this->artworkService->getAdminList();

        return response()->json([
            'success' => true,
            'data'    => ArtworkResource::collection($artworks),
        ]);
    }

    /**
     * Upload/replace image untuk slot.
     */
    public function updateImage(StoreArtworkImageRequest $request, int $id): JsonResponse
    {
        $artwork = Artwork::find($id);

        if (! $artwork) {
            return response()->json([
                'success' => false,
                'message' => 'Slot artwork tidak ditemukan.',
            ], 404);
        }

        $artwork = $this->artworkService->updateImage(
            $artwork,
            $request->file('image')
        );

        return response()->json([
            'success' => true,
            'message' => "Artwork slot #{$artwork->urutan} berhasil diupload.",
            'data'    => new ArtworkResource($artwork),
        ]);
    }

    /**
     * Kosongkan slot (hapus gambar).
     */
    public function clearImage(int $id): JsonResponse
    {
        $artwork = Artwork::find($id);

        if (! $artwork) {
            return response()->json([
                'success' => false,
                'message' => 'Slot artwork tidak ditemukan.',
            ], 404);
        }

        $artwork = $this->artworkService->clearImage($artwork);

        return response()->json([
            'success' => true,
            'message' => "Artwork slot #{$artwork->urutan} berhasil dikosongkan.",
            'data'    => new ArtworkResource($artwork),
        ]);
    }
}