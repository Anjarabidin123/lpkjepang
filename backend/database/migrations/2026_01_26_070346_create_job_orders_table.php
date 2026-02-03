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
        Schema::create('job_orders', function (Blueprint $table) {
            $table->id();
            $table->string('nama_job_order');
            $table->integer('kuota')->default(0);
            $table->string('status')->default('Aktif');
            $table->text('catatan')->nullable();
            // Foreign Keys
            $table->foreignId('jenis_kerja_id')->nullable()->constrained('jenis_kerjas')->nullOnDelete();
            $table->foreignId('kumiai_id')->nullable()->constrained('kumiais')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_orders');
    }
};
