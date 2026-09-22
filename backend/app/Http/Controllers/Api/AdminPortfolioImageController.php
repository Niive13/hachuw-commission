<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PortfolioImage\StorePortfolioImageRequest;
use App\Http\Resources\PortfolioImageResource;
use App\Models\CatalogItem;
use App\Models\PortfolioImage;
use App\Services\CatalogService;
use Illuminate\Http\JsonResponse;

class AdminPortfolioImageController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalogService
    ) {}

    public function store(StorePortfolioImageRequest $request, int $catalogId): JsonResponse
    {
        $catalog = CatalogItem::find($catalogId);

        if (! $catalog) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog tidak ditemukan.',
            ], 404);
        }

        $image = $this->catalogService->addPortfolioImage(
            $catalog,
            $request->file('image')
        );

        return response()->json([
            'success' => true,
            'message' => 'Gambar berhasil diupload.',
            'data'    => new PortfolioImageResource($image),
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $image = PortfolioImage::find($id);

        if (! $image) {
            return response()->json([
                'success' => false,
                'message' => 'Gambar tidak ditemukan.',
            ], 404);
        }

        $this->catalogService->softDeletePortfolioImage($image);

        return response()->json([
            'success' => true,
            'message' => 'Gambar berhasil dihapus.',
        ]);
    }
}