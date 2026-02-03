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
        Schema::create('siswa_magangs', function (Blueprint $table) {
            $table->id();
            
            // Relasi Utama
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            
            // Relasi Master Data (Nullable karena mungkin belum diisi lengkap saat awal)
            $table->foreignId('kumiai_id')->nullable()->constrained('kumiais')->nullOnDelete();
            $table->foreignId('perusahaan_id')->nullable()->constrained('perusahaans')->nullOnDelete();
            $table->foreignId('program_id')->nullable()->constrained('programs')->nullOnDelete();
            $table->foreignId('jenis_kerja_id')->nullable()->constrained('jenis_kerjas')->nullOnDelete();
            $table->foreignId('posisi_kerja_id')->nullable()->constrained('posisi_kerjas')->nullOnDelete();
            $table->foreignId('lpk_mitra_id')->nullable()->constrained('lpk_mitras')->nullOnDelete();
            
            // Lokasi
            $table->foreignId('demografi_province_id')->nullable()->constrained('demografi_provinces')->nullOnDelete();
            $table->foreignId('demografi_regency_id')->nullable()->constrained('demografi_regencies')->nullOnDelete();
            $table->text('lokasi')->nullable(); // Alamat detail / Jepang

            // Detail Kontrak
            $table->date('tanggal_mulai_kerja')->nullable();
            $table->date('tanggal_pulang_kerja')->nullable();
            $table->decimal('gaji', 15, 2)->nullable();
            
            $table->string('status_magang')->default('Aktif'); // Aktif, Selesai, Cut, Kabur, dll
            $table->string('avatar_url')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa_magangs');
    }
};
