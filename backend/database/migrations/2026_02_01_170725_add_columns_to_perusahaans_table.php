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
        Schema::table('perusahaans', function (Blueprint $table) {
            $table->string('telepon')->nullable();
            $table->string('bidang_usaha')->nullable();
            $table->integer('kapasitas')->nullable();
            $table->date('tanggal_kerjasama')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('perusahaans', function (Blueprint $table) {
            $table->dropColumn(['telepon', 'bidang_usaha', 'kapasitas', 'tanggal_kerjasama']);
        });
    }
};
