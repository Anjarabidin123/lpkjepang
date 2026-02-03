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
        Schema::create('kewajiban_pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->foreignId('item_pembayaran_id')->constrained('item_pembayaran')->onDelete('cascade');
            $table->decimal('nominal_wajib', 15, 2);
            $table->decimal('nominal_terbayar', 15, 2)->default(0);
            $table->decimal('sisa_kewajiban', 15, 2);
            $table->string('status')->default('Belum Lunas');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kewajiban_pembayaran');
    }
};
