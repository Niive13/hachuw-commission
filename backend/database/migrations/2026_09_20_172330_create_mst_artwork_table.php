<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mst_artwork', function (Blueprint $table) {
            $table->bigIncrements('id_artwork');
            $table->integer('urutan')->unique()->comment('Slot 1-8, tetap');
            $table->string('image_url', 500)->nullable();
            $table->tinyInteger('status')->default(1)->comment('1=aktif, 0=nonaktif');
            $table->timestamps();

            $table->index(['status', 'urutan'], 'idx_artwork_status_urutan');
        });

        // Seed 8 slot kosong.
        $now = now();
        $slots = [];
        for ($i = 1; $i <= 8; $i++) {
            $slots[] = [
                'urutan'     => $i,
                'image_url'  => null,
                'status'     => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }
        DB::table('mst_artwork')->insert($slots);
    }

    public function down(): void
    {
        Schema::dropIfExists('mst_artwork');
    }
};