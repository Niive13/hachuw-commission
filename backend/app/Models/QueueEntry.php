<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QueueEntry extends Model
{
    use HasFactory;

    protected $table = 'trs_queue';
    protected $primaryKey = 'id_queue';

    protected $fillable = [
        'queue_number',
        'customer_display_name',
        'id_catalogItem',
        'queue_status',
        'order_date',
        'estimated_completion',
        'public_note',
        'status',
    ];

    protected $casts = [
        'queue_number' => 'integer',
        'order_date' => 'date',
        'estimated_completion' => 'date',
        'status' => 'integer',
    ];

    public const STATUS = [
        'WAITING',
        'SKETCH',
        'REVISION',
        'RENDERING',
        'COMPLETED',
        'CANCELLED',
    ];

    public const ACTIVE_STATUSES = [
        'WAITING',
        'SKETCH',
        'REVISION',
        'RENDERING',
    ];

    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(CatalogItem::class, 'id_catalogItem', 'id_catalogItem');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('queue_number', 'asc');
    }
}