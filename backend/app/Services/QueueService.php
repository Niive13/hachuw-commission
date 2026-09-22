<?php

namespace App\Services;

use App\Models\QueueEntry;
use Illuminate\Database\Eloquent\Collection;

class QueueService
{
    /**
     * Status yang dihitung sebagai "active queue".
     */
    private const ACTIVE_STATUSES = ['WAITING', 'SKETCH', 'REVISION', 'RENDERING'];

    /**
     * Status yang dihitung sebagai "completed".
     */
    private const COMPLETED_STATUSES = ['COMPLETED', 'CANCELLED'];

    // ============================================================
    // PUBLIC
    // ============================================================

    /**
     * Public list: dipisah jadi active & completed.
     *
     * @return array{active: Collection, completed: Collection}
     */
    public function getPublicList(): array
    {
        $active = QueueEntry::query()
            ->active()
            ->whereIn('queue_status', self::ACTIVE_STATUSES)
            ->with(['catalogItem.kategori'])
            ->orderBy('queue_number', 'asc')
            ->get();

        $completed = QueueEntry::query()
            ->active()
            ->whereIn('queue_status', self::COMPLETED_STATUSES)
            ->with(['catalogItem.kategori'])
            ->orderBy('updated_at', 'desc')
            ->get();

        return [
            'active'    => $active,
            'completed' => $completed,
        ];
    }

    // ============================================================
    // ADMIN
    // ============================================================

    public function getAdminList(): Collection
    {
        return QueueEntry::query()
            ->with(['catalogItem' => function ($q) {
                $q->where('status', 1)->with('kategori');
            }])
            ->orderByRaw('CASE WHEN queue_status IN ("COMPLETED", "CANCELLED") THEN 1 ELSE 0 END')
            ->orderBy('queue_number', 'asc')
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    public function create(array $data): QueueEntry
    {
        // Auto-assign nomor: max queue_number dari queue AKTIF + 1.
        $maxNumber = QueueEntry::query()
            ->where('status', 1)
            ->whereIn('queue_status', self::ACTIVE_STATUSES)
            ->max('queue_number') ?? 0;

        $queue = QueueEntry::create([
            'queue_number'          => $maxNumber + 1,
            'customer_display_name' => $data['customer_display_name'],
            'id_catalogItem'        => $data['id_catalogItem'],
            'queue_status'          => $data['queue_status'],
            'order_date'            => $data['order_date'],
            'estimated_completion'  => $data['estimated_completion'] ?? null,
            'public_note'           => $data['public_note'] ?? null,
            'status'                => $data['status'] ?? 1,
        ]);

        // Renumber (aman kalau queue baru langsung completed).
        $this->renumberActiveQueues();

        return $queue->fresh();
    }

    public function update(QueueEntry $queue, array $data): QueueEntry
    {
        $payload = [];

        foreach ([
            'customer_display_name',
            'id_catalogItem',
            'queue_status',
            'order_date',
            'estimated_completion',
            'public_note',
            'status',
        ] as $field) {
            if (array_key_exists($field, $data)) {
                $payload[$field] = $data[$field];
            }
        }

        $queue->update($payload);

        // Renumber setelah update.
        $this->renumberActiveQueues();

        return $queue->fresh();
    }

    public function softDelete(QueueEntry $queue): bool
    {
        $result = $queue->update(['status' => 0]);

        $this->renumberActiveQueues();

        return $result;
    }

        /**
     * Reorder queue aktif berdasarkan array id_queue.
     * Nomor akan di-assign 1..N sesuai urutan array.
     */
    public function reorderActive(array $orderedIds): void
    {
        // Filter hanya queue yang aktif (status=1, queue_status aktif).
        $validQueues = QueueEntry::query()
            ->where('status', 1)
            ->whereIn('queue_status', self::ACTIVE_STATUSES)
            ->whereIn('id_queue', $orderedIds)
            ->get()
            ->keyBy('id_queue');

        $number = 1;
        foreach ($orderedIds as $id) {
            if (! isset($validQueues[$id])) {
                continue;
            }

            $queue = $validQueues[$id];
            $queue->timestamps = false;
            $queue->queue_number = $number;
            $queue->save();
            $queue->timestamps = true;

            $number++;
        }

        // Sisa queue aktif yang tidak ada di list → assign nomor paling akhir.
        $remaining = QueueEntry::query()
            ->where('status', 1)
            ->whereIn('queue_status', self::ACTIVE_STATUSES)
            ->whereNotIn('id_queue', $orderedIds)
            ->orderBy('queue_number', 'asc')
            ->get();

        foreach ($remaining as $queue) {
            $queue->timestamps = false;
            $queue->queue_number = $number;
            $queue->save();
            $queue->timestamps = true;
            $number++;
        }
    }

    // ============================================================
    // HELPER
    // ============================================================

    /**
     * Renumber queue ACTIVE supaya nomornya 1..N tanpa gap.
     * Queue completed/cancelled TIDAK dihitung.
     */
    public function renumberActiveQueues(): void
    {
        $queues = QueueEntry::query()
            ->where('status', 1)
            ->whereIn('queue_status', self::ACTIVE_STATUSES)
            ->orderBy('queue_number', 'asc')
            ->orderBy('id_queue', 'asc')
            ->get();

        $number = 1;
        foreach ($queues as $queue) {
            if ((int) $queue->queue_number !== $number) {
                $queue->queue_number = $number;
                $queue->saveQuietly(); // saveQuietly: skip events/timestamps update? 
                // NOTE: saveQuietly tetap update timestamp. Kalau tidak mau update timestamp, pakai ->timestamps = false.
            }
            $number++;
        }
    }
}