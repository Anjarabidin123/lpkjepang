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
        // Tabel Absensi
        Schema::create('student_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->date('date');
            $table->enum('status', ['hadiir', 'izin', 'sakit', 'alpha'])->default('hadiir');
            $table->string('notes')->nullable();
            $table->timestamps();
            
            $table->unique(['siswa_id', 'date']);
        });

        // Tabel Penilaian (Ujian Bahasa/Keterampilan)
        Schema::create('student_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->string('subject'); // e.g., Hiragana, Katakana, JLPT N5, JFT
            $table->integer('score');
            $table->date('exam_date');
            $table->enum('result', ['pass', 'fail', 'remidi'])->default('pass');
            $table->text('teacher_comments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_attendances');
        Schema::dropIfExists('student_grades');
    }
};
