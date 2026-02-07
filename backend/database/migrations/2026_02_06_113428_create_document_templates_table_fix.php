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
        if (!Schema::hasTable('document_templates')) {
            Schema::create('document_templates', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('kode')->unique();
                $table->string('nama');
                $table->string('kategori');
                $table->text('deskripsi')->nullable();
                $table->longText('template_content')->nullable();
                $table->boolean('is_active')->default(true);
                $table->boolean('is_required')->default(true);
                $table->integer('urutan')->default(0);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_templates');
    }
};
