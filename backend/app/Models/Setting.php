<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'mst_setting';
    protected $primaryKey = 'id_setting';

    protected $fillable = ['key', 'value', 'description'];

    // ============================================================
    // HELPER METHODS
    // ============================================================

    /**
     * Get setting value by key.
     */
    public static function get(string $key, ?string $default = null): ?string
    {
        $setting = static::where('key', $key)->first();
        return $setting?->value ?? $default;
    }

    /**
     * Set or update setting value.
     */
    public static function set(string $key, ?string $value, ?string $description = null): void
    {
        static::updateOrCreate(
            ['key' => $key],
            [
                'value'       => $value,
                'description' => $description ?? \Illuminate\Support\Facades\DB::raw('description'),
            ],
        );
    }
}