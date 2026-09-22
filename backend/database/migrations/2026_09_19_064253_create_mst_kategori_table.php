<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mst_kategori', function (Blueprint $table) {
            $table->bigIncrements('id_kategori');
            $table->string('nama', 50);
            $table->string('slug', 50)->unique();
            $table->integer('urutan')->default(0);
            $table->tinyInteger('status')->default(1)->comment('1=aktif, 0=nonaktif');
            $table->timestamps();

            $table->index(['status', 'urutan'], 'idx_kategori_status_urutan');
        });

        // Seed data awal langsung dari migration,
        // supaya data migration di migration berikutnya aman.
        DB::table('mst_kategori')->insert([
            [
                'nama'       => 'Illustration',
                'slug'       => 'illustration',
                'urutan'     => 1,
                'status'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama'       => 'PNGTuber',
                'slug'       => 'pngtuber',
                'urutan'     => 2,
                'status'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama'       => 'Custom Emote',
                'slug'       => 'custom_emote',
                'urutan'     => 3,
                'status'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('mst_kategori');
    }
};