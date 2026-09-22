<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicQueueResource;
use App\Services\QueueService;
use Illuminate\Http\JsonResponse;

class PublicQueueController extends Controller
{
    public function __construct(
        private readonly QueueService $queueService
    ) {}

    public function index(): JsonResponse
    {
        $data = $this->queueService->getPublicList();

        return response()->json([
            'success' => true,
            'data'    => [
                'active'    => PublicQueueResource::collection($data['active']),
                'completed' => PublicQueueResource::collection($data['completed']),
            ],
        ]);
    }
}