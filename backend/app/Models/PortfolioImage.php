<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioImage extends Model
{
    use HasFactory;

    protected $table = 'mst_portfolioImage';
    protected $primaryKey = 'id_portfolioImage';

    protected $fillable = [
        'id_catalogItem',
        'image_url',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(CatalogItem::class, 'id_catalogItem', 'id_catalogItem');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }
}