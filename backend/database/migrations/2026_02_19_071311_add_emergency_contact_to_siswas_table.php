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
        Schema::table('siswas', function (Blueprint $table) {
            $table->string('kontak_darurat_nama')->nullable();
            $table->string('kontak_darurat_no_hp')->nullable();
            $table->text('kontak_darurat_alamat')->nullable();
            $table->string('kontak_darurat_rt_rw')->nullable();
            $table->string('kontak_darurat_kelurahan')->nullable();
            $table->string('kontak_darurat_kecamatan')->nullable();
            $table->string('kontak_darurat_kab_kota')->nullable();
            $table->string('kontak_darurat_provinsi')->nullable();
            $table->string('kontak_darurat_kode_pos')->nullable();
            $table->decimal('kontak_darurat_penghasilan_per_bulan', 15, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            $table->dropColumn([
                'kontak_darurat_nama',
                'kontak_darurat_no_hp',
                'kontak_darurat_alamat',
                'kontak_darurat_rt_rw',
                'kontak_darurat_kelurahan',
                'kontak_darurat_kecamatan',
                'kontak_darurat_kab_kota',
                'kontak_darurat_provinsi',
                'kontak_darurat_kode_pos',
                'kontak_darurat_penghasilan_per_bulan'
            ]);
        });
    }
};
