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
        Schema::create('document_variables', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->unique();
            $table->string('display_name');
            $table->string('kategori');
            $table->string('source_table');
            $table->string('source_field');
            $table->string('format_type')->default('text');
            $table->text('default_value')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_variables');
    }
};
