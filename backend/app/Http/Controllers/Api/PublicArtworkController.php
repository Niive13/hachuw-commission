<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArtworkResource;
use App\Services\ArtworkService;
use Illuminate\Http\JsonResponse;

class PublicArtworkController extends Controller
{
    public function __construct(
        private readonly ArtworkService $artworkService
    ) {}

    public function index(): JsonResponse
    {
        $artworks = $this->artworkService->getPublicList();

        return response()->json([
            'success' => true,
            'data'    => ArtworkResource::collection($artworks),
        ]);
    }
}