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
        Schema::table('posisi_kerjas', function (Blueprint $table) {
            $table->string('posisi')->nullable();
            $table->string('lokasi')->nullable();
            $table->integer('kuota')->nullable();
            $table->integer('terisi')->default(0);
            $table->decimal('gaji_harian', 15, 2)->nullable();
            $table->string('jam_kerja')->nullable();
            $table->text('persyaratan')->nullable();
            $table->string('status')->default('Buka');
            $table->date('tanggal_buka')->nullable();
            $table->date('tanggal_tutup')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posisi_kerjas', function (Blueprint $table) {
            $table->dropColumn([
                'posisi',
                'lokasi',
                'kuota',
                'terisi',
                'gaji_harian',
                'jam_kerja',
                'persyaratan',
                'status',
                'tanggal_buka',
                'tanggal_tutup'
            ]);
        });
    }
};
