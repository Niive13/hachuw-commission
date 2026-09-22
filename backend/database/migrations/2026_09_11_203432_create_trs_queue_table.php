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
        Schema::create('trs_queue', function (Blueprint $table) {
            $table->bigIncrements('id_queue');
            $table->integer('queue_number');
            $table->string('customer_display_name', 100);
            $table->unsignedBigInteger('id_catalogItem');
            $table->enum('queue_status', [
                'WAITING', 'SKETCH', 'REVISION', 'RENDERING', 'COMPLETED', 'CANCELLED'
            ]);
            $table->date('order_date');
            $table->date('estimated_completion')->nullable();
            $table->text('public_note')->nullable();
            $table->tinyInteger('status')->default(1)->comment('1=aktif, 0=soft deleted');
            $table->timestamps();

            $table->foreign('id_catalogItem')
                  ->references('id_catalogItem')
                  ->on('mst_catalogItem')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');

            $table->index(['status', 'queue_status'], 'idx_queue_status');
            $table->index('queue_number', 'idx_queue_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trs_queue');
    }
};
