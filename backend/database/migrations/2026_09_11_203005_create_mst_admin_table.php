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
        Schema::create('mst_admin', function (Blueprint $table) {
            $table->bigIncrements('id_admin');
            $table->string('username', 50)->unique();
            $table->string('password', 255);
            $table->tinyInteger('status')->default(1)->comment('1=aktif, 0=nonaktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mst_admin');
    }
};
