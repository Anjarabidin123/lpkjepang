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
        Schema::table('kumiais', function (Blueprint $table) {
            if (!Schema::hasColumn('kumiais', 'jumlah_perusahaan')) {
                $table->integer('jumlah_perusahaan')->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kumiais', function (Blueprint $table) {
            if (Schema::hasColumn('kumiais', 'jumlah_perusahaan')) {
                $table->dropColumn(['jumlah_perusahaan']);
            }
        });
    }
};
