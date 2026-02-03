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
        Schema::create('kategori_pemasukan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kategori');
            $table->text('deskripsi')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pemasukan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_id')->nullable()->constrained('kategori_pemasukan')->onDelete('set null');
            $table->string('nama_pemasukan');
            $table->decimal('nominal', 15, 2);
            $table->date('tanggal_pemasukan');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        Schema::create('kategori_pengeluaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kategori');
            $table->text('deskripsi')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('pengeluaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_id')->nullable()->constrained('kategori_pengeluaran')->onDelete('set null');
            $table->string('nama_pengeluaran');
            $table->decimal('nominal', 15, 2);
            $table->date('tanggal_pengeluaran');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengeluaran');
        Schema::dropIfExists('kategori_pengeluaran');
        Schema::dropIfExists('pemasukan');
        Schema::dropIfExists('kategori_pemasukan');
    }
};
