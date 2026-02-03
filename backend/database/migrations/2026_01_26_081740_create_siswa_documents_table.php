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
        Schema::create('siswa_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_magang_id')->constrained('siswa_magangs')->onDelete('cascade');
            // document_template_id nullable karena bisa saja upload dokumen lepas (bukan template)
            $table->foreignId('document_template_id')->nullable()->constrained('document_templates')->nullOnDelete();
            
            $table->string('nama')->nullable(); // Nama File / Display Name
            $table->string('file_path')->nullable(); // Path di Storage
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa_documents');
    }
};
