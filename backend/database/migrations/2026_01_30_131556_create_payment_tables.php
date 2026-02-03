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
        Schema::create('item_pembayaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama_item');
            $table->decimal('nominal_wajib', 15, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('internal_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->foreignId('item_pembayaran_id')->constrained('item_pembayaran')->onDelete('cascade');
            $table->decimal('nominal', 15, 2);
            $table->date('tanggal_pembayaran');
            $table->string('metode_pembayaran')->default('Tunai');
            $table->string('status')->default('Lunas');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internal_payments');
        Schema::dropIfExists('item_pembayaran');
    }
};
