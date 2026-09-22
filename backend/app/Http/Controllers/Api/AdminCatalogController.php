<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\StoreCatalogRequest;
use App\Http\Requests\Catalog\UpdateCatalogRequest;
use App\Http\Resources\AdminCatalogDetailResource;
use App\Http\Resources\AdminCatalogResource;
use App\Models\CatalogItem;
use App\Services\CatalogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCatalogController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalogService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $catalogs = $this->catalogService->getAdminList();

        return response()->json([
            'success' => true,
            'data'    => AdminCatalogResource::collection($catalogs),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $catalog = $this->catalogService->getAdminDetail($id);

        if (! $catalog) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new AdminCatalogDetailResource($catalog),
        ]);
    }

    public function store(StoreCatalogRequest $request): JsonResponse
    {
        $catalog = $this->catalogService->create(
            $request->validated(),
            $request->file('cover_image')
        );

        return response()->json([
            'success' => true,
            'message' => 'Catalog berhasil dibuat.',
            'data'    => new AdminCatalogResource($catalog),
        ], 201);
    }

    public function update(UpdateCatalogRequest $request, int $id): JsonResponse
    {
        $catalog = CatalogItem::find($id);

        if (! $catalog) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog tidak ditemukan.',
            ], 404);
        }

        $catalog = $this->catalogService->update(
            $catalog,
            $request->validated(),
            $request->file('cover_image')
        );

        return response()->json([
            'success' => true,
            'message' => 'Catalog berhasil diperbarui.',
            'data'    => new AdminCatalogDetailResource($catalog->load('portfolioImages')),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $catalog = CatalogItem::find($id);

        if (! $catalog) {
            return response()->json([
                'success' => false,
                'message' => 'Catalog tidak ditemukan.',
            ], 404);
        }

        $this->catalogService->softDelete($catalog);

        return response()->json([
            'success' => true,
            'message' => 'Catalog berhasil dihapus.',
        ]);
    }
}