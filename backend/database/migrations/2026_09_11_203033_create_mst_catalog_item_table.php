<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mst_catalogItem', function (Blueprint $table) {
            $table->bigIncrements('id_catalogItem');
            $table->enum('kategori', ['ILLUSTRATION', 'PNGTUBER', 'CUSTOM_EMOTE']);
            $table->string('nama', 150);
            $table->decimal('price', 12, 2);
            $table->tinyInteger('status')->default(1)->comment('1=aktif, 0=nonaktif');
            $table->string('cover_image', 500)->nullable();
            $table->timestamps();

            $table->index(['kategori', 'status'], 'idx_catalog_kategori_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mst_catalogItem');
    }
};
