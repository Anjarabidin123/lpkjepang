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
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('subject'); // Mata Pelajaran (e.g. "Bahasa Jepang N4")
            $table->string('day_of_week'); // Hari (e.g. "Senin", "Monday")
            $table->time('start_time'); // Jam Mulai
            $table->time('end_time'); // Jam Selesai
            $table->string('room')->nullable(); // Ruangan
            $table->string('teacher_name')->nullable(); // Nama Pengajar
            $table->text('notes')->nullable(); // Catatan tambahan
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_schedules');
    }
};
