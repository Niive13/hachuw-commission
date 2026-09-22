<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CatalogDetailResource;
use App\Http\Resources\CatalogResource;
use App\Services\CatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicCatalogController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalogService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $kategoriSlug = $request->query('kategori');
        $catalogs = $this->catalogService->getPublicList($kategoriSlug);

        return response()->json([
            'success' => true,
            'data'    => CatalogResource::collection($catalogs),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $catalog = $this->catalogService->getPublicDetail($id);

        if (! $catalog) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new CatalogDetailResource($catalog),
        ]);
    }
}