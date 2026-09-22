<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatalogItem extends Model
{
    use HasFactory;

    protected $table = 'mst_catalogItem';
    protected $primaryKey = 'id_catalogItem';

    protected $fillable = [
        'nama',
        'deskripsi',       // ← tambah
        'id_kategori',
        'price',
        'price_max',
        'status',
        'cover_image',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'price_max' => 'decimal:2',
        'status' => 'integer',
    ];

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'id_kategori', 'id_kategori');
    }

    public function portfolioImages(): HasMany
    {
        return $this->hasMany(PortfolioImage::class, 'id_catalogItem', 'id_catalogItem');
    }

    public function queues(): HasMany
    {
        return $this->hasMany(QueueEntry::class, 'id_catalogItem', 'id_catalogItem');
    }

    // ============================================================
    // SCOPES
    // ============================================================

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeByKategori($query, int $idKategori)
    {
        return $query->where('id_kategori', $idKategori);
    }

    public function scopeByKategoriSlug($query, string $slug)
    {
        return $query->whereHas('kategori', function ($q) use ($slug) {
            $q->where('slug', $slug);
        });
    }
}