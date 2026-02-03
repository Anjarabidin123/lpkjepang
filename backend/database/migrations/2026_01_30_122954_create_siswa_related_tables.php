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
        Schema::create('siswa_keluarga_indonesia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->string('nama');
            $table->string('hubungan')->nullable();
            $table->integer('umur')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->timestamps();
        });

        Schema::create('siswa_keluarga_jepang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->string('nama');
            $table->string('hubungan')->nullable();
            $table->integer('umur')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->timestamps();
        });

        Schema::create('siswa_kontak_keluarga', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->string('nama');
            $table->string('alamat')->nullable();
            $table->string('rt_rw')->nullable();
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kab_kota')->nullable();
            $table->string('provinsi')->nullable();
            $table->string('kode_pos')->nullable();
            $table->string('no_hp')->nullable();
            $table->decimal('penghasilan_per_bulan', 15, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('siswa_pengalaman_kerja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->string('nama_perusahaan');
            $table->string('jenis_pekerjaan')->nullable();
            $table->integer('tahun_masuk')->nullable();
            $table->integer('tahun_keluar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa_pengalaman_kerja');
        Schema::dropIfExists('siswa_kontak_keluarga');
        Schema::dropIfExists('siswa_keluarga_jepang');
        Schema::dropIfExists('siswa_keluarga_indonesia');
    }
};
