<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mst_catalogItem', function (Blueprint $table) {
            $table->decimal('price_max', 12, 2)
                ->nullable()
                ->after('price')
                ->comment('Harga maksimum (opsional). NULL = harga tunggal.');
        });
    }

    public function down(): void
    {
        Schema::table('mst_catalogItem', function (Blueprint $table) {
            $table->dropColumn('price_max');
        });
    }
};