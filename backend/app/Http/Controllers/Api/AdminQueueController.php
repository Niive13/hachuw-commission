<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Queue\StoreQueueRequest;
use App\Http\Requests\Queue\UpdateQueueRequest;
use App\Http\Resources\AdminQueueResource;
use Illuminate\Http\Request;
use App\Models\QueueEntry;
use App\Services\QueueService;
use Illuminate\Http\JsonResponse;

class AdminQueueController extends Controller
{
    public function __construct(
        private readonly QueueService $queueService
    ) {}

    public function index(): JsonResponse
    {
        $queues = $this->queueService->getAdminList();

        return response()->json([
            'success' => true,
            'data'    => AdminQueueResource::collection($queues),
        ]);
    }

    public function store(StoreQueueRequest $request): JsonResponse
    {
        $queue = $this->queueService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Queue berhasil ditambahkan.',
            'data'    => new AdminQueueResource($queue->load('catalogItem')),
        ], 201);
    }

    public function update(UpdateQueueRequest $request, int $id): JsonResponse
    {
        $queue = QueueEntry::find($id);

        if (! $queue) {
            return response()->json([
                'success' => false,
                'message' => 'Queue tidak ditemukan.',
            ], 404);
        }

        $queue = $this->queueService->update($queue, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Queue berhasil diperbarui.',
            'data'    => new AdminQueueResource($queue->load('catalogItem')),
        ]);
    }

    /**
     * Reorder queue aktif berdasarkan array id_queue yang dikirim.
     * Body: { ids: [5, 3, 1, 2] }
     */
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'integer', 'exists:trs_queue,id_queue'],
        ]);

        $this->queueService->reorderActive($validated['ids']);

        return response()->json([
            'success' => true,
            'message' => 'Urutan queue berhasil diperbarui.',
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $queue = QueueEntry::find($id);

        if (! $queue) {
            return response()->json([
                'success' => false,
                'message' => 'Queue tidak ditemukan.',
            ], 404);
        }

        $this->queueService->softDelete($queue);

        return response()->json([
            'success' => true,
            'message' => 'Queue berhasil dihapus.',
        ]);
    }
}