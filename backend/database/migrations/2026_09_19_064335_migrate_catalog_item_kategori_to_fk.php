<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // STEP 1 — Tambah kolom id_kategori (nullable, sementara).
        Schema::table('mst_catalogItem', function (Blueprint $table) {
            $table->unsignedBigInteger('id_kategori')->nullable()->after('nama');
        });

        // STEP 2 — Migrate data dari ENUM lama ke FK baru.
        // Mapping berdasarkan slug (lowercase ENUM value).
        $mapping = [
            'ILLUSTRATION'  => 'illustration',
            'PNGTUBER'      => 'pngtuber',
            'CUSTOM_EMOTE'  => 'custom_emote',
        ];

        foreach ($mapping as $oldEnum => $slug) {
            $kategori = DB::table('mst_kategori')->where('slug', $slug)->first();
            if ($kategori) {
                DB::table('mst_catalogItem')
                    ->where('kategori', $oldEnum)
                    ->update(['id_kategori' => $kategori->id_kategori]);
            }
        }

        // STEP 3 — Hapus kolom ENUM lama.
        Schema::table('mst_catalogItem', function (Blueprint $table) {
            $table->dropColumn('kategori');
        });

        // STEP 4 — Ubah id_kategori jadi NOT NULL + tambah FK.
        // Note: Laravel tidak bisa langsung ->change() untuk nullable→not null dengan FK,
        // jadi pakai raw SQL.
                // STEP 4 — Ubah id_kategori jadi NOT NULL + tambah FK.
        // Note: Laravel tidak bisa langsung ->change() untuk nullable→not null dengan FK,
        // jadi pakai raw SQL.
        DB::statement('ALTER TABLE mst_catalogItem MODIFY id_kategori BIGINT UNSIGNED NOT NULL');

        Schema::table('mst_catalogItem', function (Blueprint $table) {
            $table->foreign('id_kategori')
                  ->references('id_kategori')
                  ->on('mst_kategori')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
        });

        // Drop index lama (dari migration awal, kolom 'kategori' sudah tidak ada).
        // Index lama jadi hanya menutupi 'status' — tidak diperlukan lagi.
        $oldIndex = DB::select("SHOW INDEX FROM mst_catalogItem WHERE Key_name = 'idx_catalog_kategori_status'");
        if (!empty($oldIndex)) {
            DB::statement('ALTER TABLE mst_catalogItem DROP INDEX idx_catalog_kategori_status');
        }

        // Buat index baru dengan nama unik (untuk avoid konflik).
        Schema::table('mst_catalogItem', function (Blueprint $table) {
            $table->index(['id_kategori', 'status'], 'idx_catalogitem_kategori_status');
        });
    }

    public function down(): void
    {
        // Rollback: recreate ENUM column, drop FK & id_kategori.
        Schema::table('mst_catalogItem', function (Blueprint $table) {
            $table->dropForeign(['id_kategori']);
            $table->dropIndex('idx_catalog_kategori_status');
        });

        Schema::table('mst_catalogItem', function (Blueprint $table) {
            $table->enum('kategori', ['ILLUSTRATION', 'PNGTUBER', 'CUSTOM_EMOTE'])
                  ->default('ILLUSTRATION')
                  ->after('nama');

            // Restore data dari mapping terbalik.
            DB::statement('UPDATE mst_catalogItem c JOIN mst_kategori k ON c.id_kategori = k.id_kategori SET c.kategori = UPPER(k.slug)');

            $table->dropColumn('id_kategori');
        });
    }
};