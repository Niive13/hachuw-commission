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
        Schema::create('mst_portfolioImage', function (Blueprint $table) {
            $table->bigIncrements('id_portfolioImage');
            $table->unsignedBigInteger('id_catalogItem');
            $table->string('image_url', 500);
            $table->tinyInteger('status')->default(1)->comment('1=aktif, 0=soft deleted');
            $table->timestamps();

            $table->foreign('id_catalogItem')
                  ->references('id_catalogItem')
                  ->on('mst_catalogItem')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->index(['id_catalogItem', 'status'], 'idx_portfolio_catalog_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mst_portfolioImage');
    }
};
