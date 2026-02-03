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
        Schema::create('demografi_regencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->constrained('demografi_provinces')->onDelete('cascade');
            $table->string('kode')->unique();
            $table->string('nama');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demografi_regencies');
    }
};
