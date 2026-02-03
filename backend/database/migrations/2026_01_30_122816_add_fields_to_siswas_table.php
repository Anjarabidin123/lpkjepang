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
            $table->string('tempat_lahir')->nullable()->after('tanggal_lahir');
            $table->string('telepon')->nullable()->after('no_hp');
            $table->integer('tinggi_badan')->nullable();
            $table->integer('berat_badan')->nullable();
            $table->integer('ukuran_sepatu')->nullable();
            $table->string('golongan_darah')->nullable();
            $table->string('status_pernikahan')->nullable();
            $table->string('agama')->nullable();
            $table->string('hobi')->nullable();
            $table->text('visi')->nullable();
            $table->string('target_gaji')->nullable();
            $table->string('pengalaman_jepang')->nullable();
            $table->string('skill_bahasa_jepang')->nullable();
            
            $table->foreignId('program_id')->nullable()->constrained('programs')->nullOnDelete();
            $table->foreignId('posisi_kerja_id')->nullable()->constrained('posisi_kerjas')->nullOnDelete();
            $table->foreignId('lpk_mitra_id')->nullable()->constrained('lpk_mitras')->nullOnDelete();
            
            $table->date('tanggal_daftar')->nullable();
            $table->string('foto_siswa')->nullable();
            $table->string('foto_url')->nullable();
            
            $table->string('nama_sekolah')->nullable();
            $table->integer('tahun_masuk_sekolah')->nullable();
            $table->integer('tahun_lulus_sekolah')->nullable();
            $table->string('jurusan')->nullable();
            $table->integer('umur')->nullable();
            
            $table->string('mata_kanan')->nullable();
            $table->string('mata_kiri')->nullable();
            $table->integer('ukuran_kepala')->nullable();
            $table->integer('ukuran_pinggang')->nullable();
            
            $table->string('merokok_sekarang')->nullable();
            $table->string('merokok_jepang')->nullable();
            $table->string('minum_sake')->nullable();
            $table->string('penggunaan_tangan')->nullable();
            $table->boolean('buta_warna')->default(false);
            $table->string('warna_buta')->nullable();
            
            $table->text('bakat_khusus')->nullable();
            $table->text('kelebihan')->nullable();
            $table->text('kekurangan')->nullable();
            $table->text('pengalaman')->nullable();
            $table->text('minat')->nullable();
            $table->text('tujuan_jepang')->nullable();
            $table->string('target_menabung')->nullable();
            
            $table->date('tanggal_masuk_lpk')->nullable();
            $table->string('lama_belajar')->nullable();
            $table->text('catatan')->nullable();
            $table->boolean('is_available')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            $table->dropForeign(['program_id']);
            $table->dropForeign(['posisi_kerja_id']);
            $table->dropForeign(['lpk_mitra_id']);
            
            $table->dropColumn([
                'tempat_lahir', 'telepon', 'tinggi_badan', 'berat_badan', 'ukuran_sepatu',
                'golongan_darah', 'status_pernikahan', 'agama', 'hobi', 'visi',
                'target_gaji', 'pengalaman_jepang', 'skill_bahasa_jepang',
                'program_id', 'posisi_kerja_id', 'lpk_mitra_id',
                'tanggal_daftar', 'foto_siswa', 'foto_url',
                'nama_sekolah', 'tahun_masuk_sekolah', 'tahun_lulus_sekolah', 'jurusan',
                'umur', 'mata_kanan', 'mata_kiri', 'ukuran_kepala', 'ukuran_pinggang',
                'merokok_sekarang', 'merokok_jepang', 'minum_sake', 'penggunaan_tangan',
                'buta_warna', 'warna_buta', 'bakat_khusus', 'kelebihan', 'kekurangan',
                'pengalaman', 'minat', 'tujuan_jepang', 'target_menabung',
                'tanggal_masuk_lpk', 'lama_belajar', 'catatan', 'is_available'
            ]);
        });
    }
};
