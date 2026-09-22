<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kategori extends Model
{
    use HasFactory;

    protected $table = 'mst_kategori';
    protected $primaryKey = 'id_kategori';

    protected $fillable = [
        'nama',
        'slug',
        'urutan',
        'status',
    ];

    protected $casts = [
        'urutan' => 'integer',
        'status' => 'integer',
    ];

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    public function catalogItems(): HasMany
    {
        return $this->hasMany(CatalogItem::class, 'id_kategori', 'id_kategori');
    }

    // ============================================================
    // SCOPES
    // ============================================================

    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('urutan', 'asc')->orderBy('id_kategori', 'asc');
    }
}