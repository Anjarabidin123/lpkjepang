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
        Schema::create('posisi_kerjas', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique()->nullable();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->foreignId('perusahaan_id')->nullable()->constrained('perusahaans')->nullOnDelete();
            $table->foreignId('jenis_kerja_id')->nullable()->constrained('jenis_kerjas')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posisi_kerjas');
    }
};
