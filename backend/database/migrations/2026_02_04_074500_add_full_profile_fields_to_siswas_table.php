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
            // Personal Info
            if (!Schema::hasColumn('siswas', 'tempat_lahir')) $table->string('tempat_lahir')->nullable();
            if (!Schema::hasColumn('siswas', 'foto_siswa')) $table->string('foto_siswa')->nullable();
            if (!Schema::hasColumn('siswas', 'telepon')) $table->string('telepon')->nullable(); // Standardizing to telepon
            
            // Physical Bio
            if (!Schema::hasColumn('siswas', 'tinggi_badan')) $table->integer('tinggi_badan')->nullable();
            if (!Schema::hasColumn('siswas', 'berat_badan')) $table->integer('berat_badan')->nullable();
            if (!Schema::hasColumn('siswas', 'ukuran_sepatu')) $table->integer('ukuran_sepatu')->nullable();
            if (!Schema::hasColumn('siswas', 'ukuran_kepala')) $table->integer('ukuran_kepala')->nullable();
            if (!Schema::hasColumn('siswas', 'ukuran_pinggang')) $table->integer('ukuran_pinggang')->nullable();
            if (!Schema::hasColumn('siswas', 'golongan_darah')) $table->string('golongan_darah')->nullable();
            if (!Schema::hasColumn('siswas', 'mata_kanan')) $table->string('mata_kanan')->nullable();
            if (!Schema::hasColumn('siswas', 'mata_kiri')) $table->string('mata_kiri')->nullable();
            if (!Schema::hasColumn('siswas', 'buta_warna')) $table->boolean('buta_warna')->default(false);
            if (!Schema::hasColumn('siswas', 'warna_buta')) $table->string('warna_buta')->nullable();
            if (!Schema::hasColumn('siswas', 'penggunaan_tangan')) $table->string('penggunaan_tangan')->default('Kanan');
            
            // Social & Habits
            if (!Schema::hasColumn('siswas', 'status_pernikahan')) $table->string('status_pernikahan')->nullable();
            if (!Schema::hasColumn('siswas', 'agama')) $table->string('agama')->nullable();
            if (!Schema::hasColumn('siswas', 'merokok_sekarang')) $table->string('merokok_sekarang')->nullable();
            if (!Schema::hasColumn('siswas', 'merokok_jepang')) $table->string('merokok_jepang')->nullable();
            if (!Schema::hasColumn('siswas', 'minum_sake')) $table->string('minum_sake')->nullable();
            
            // Additional Profile
            if (!Schema::hasColumn('siswas', 'hobi')) $table->text('hobi')->nullable();
            if (!Schema::hasColumn('siswas', 'visi')) $table->text('visi')->nullable();
            if (!Schema::hasColumn('siswas', 'target_gaji')) $table->string('target_gaji')->nullable();
            if (!Schema::hasColumn('siswas', 'minat')) $table->text('minat')->nullable();
            if (!Schema::hasColumn('siswas', 'kelebihan')) $table->text('kelebihan')->nullable();
            if (!Schema::hasColumn('siswas', 'kekurangan')) $table->text('kekurangan')->nullable();
            if (!Schema::hasColumn('siswas', 'bakat_khusus')) $table->text('bakat_khusus')->nullable();
            if (!Schema::hasColumn('siswas', 'pengalaman')) $table->text('pengalaman')->nullable();
            if (!Schema::hasColumn('siswas', 'tujuan_jepang')) $table->text('tujuan_jepang')->nullable();
            if (!Schema::hasColumn('siswas', 'target_menabung')) $table->string('target_menabung')->nullable();
            if (!Schema::hasColumn('siswas', 'catatan')) $table->text('catatan')->nullable();

            // Japan & Language Skills
            if (!Schema::hasColumn('siswas', 'pengalaman_jepang')) $table->string('pengalaman_jepang')->nullable();
            if (!Schema::hasColumn('siswas', 'skill_bahasa_jepang')) $table->string('skill_bahasa_jepang')->nullable();
            
            // Education
            if (!Schema::hasColumn('siswas', 'nama_sekolah')) $table->string('nama_sekolah')->nullable();
            if (!Schema::hasColumn('siswas', 'tahun_masuk_sekolah')) $table->integer('tahun_masuk_sekolah')->nullable();
            if (!Schema::hasColumn('siswas', 'tahun_lulus_sekolah')) $table->integer('tahun_lulus_sekolah')->nullable();
            if (!Schema::hasColumn('siswas', 'jurusan')) $table->string('jurusan')->nullable();

            // Program & Registration Info
            if (!Schema::hasColumn('siswas', 'tanggal_daftar')) $table->date('tanggal_daftar')->nullable();
            if (!Schema::hasColumn('siswas', 'tanggal_masuk_lpk')) $table->date('tanggal_masuk_lpk')->nullable();
            if (!Schema::hasColumn('siswas', 'lama_belajar')) $table->string('lama_belajar')->nullable();
            
            // Foreign Keys (Nullable)
            if (!Schema::hasColumn('siswas', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('siswas', 'program_id')) {
                $table->foreignId('program_id')->nullable()->constrained('programs')->nullOnDelete();
            }
            if (!Schema::hasColumn('siswas', 'posisi_kerja_id')) {
                $table->foreignId('posisi_kerja_id')->nullable()->constrained('posisi_kerjas')->nullOnDelete();
            }
            if (!Schema::hasColumn('siswas', 'lpk_mitra_id')) {
                $table->foreignId('lpk_mitra_id')->nullable()->constrained('lpk_mitras')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['program_id']);
            $table->dropForeign(['posisi_kerja_id']);
            $table->dropForeign(['lpk_mitra_id']);
            $table->dropColumn([
                'tempat_lahir', 'foto_siswa', 'telepon', 'tinggi_badan', 'berat_badan',
                'ukuran_sepatu', 'ukuran_kepala', 'ukuran_pinggang', 'golongan_darah',
                'mata_kanan', 'mata_kiri', 'buta_warna', 'warna_buta', 'penggunaan_tangan',
                'status_pernikahan', 'agama', 'merokok_sekarang', 'merokok_jepang', 'minum_sake',
                'hobi', 'visi', 'target_gaji', 'minat', 'kelebihan', 'kekurangan', 'bakat_khusus',
                'pengalaman', 'tujuan_jepang', 'target_menabung', 'catatan',
                'pengalaman_jepang', 'skill_bahasa_jepang',
                'nama_sekolah', 'tahun_masuk_sekolah', 'tahun_lulus_sekolah', 'jurusan',
                'tanggal_daftar', 'tanggal_masuk_lpk', 'lama_belajar',
                'user_id', 'program_id', 'posisi_kerja_id', 'lpk_mitra_id'
            ]);
        });
    }
};
