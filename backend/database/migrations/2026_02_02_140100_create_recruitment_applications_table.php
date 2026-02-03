<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recruitment_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_number')->unique();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            $table->foreignId('program_id')->nullable()->constrained('programs')->onDelete('set null');
            $table->enum('status', ['new', 'review', 'interview', 'accepted', 'rejected', 'withdrawn'])->default('new');
            $table->date('application_date');
            $table->date('interview_date')->nullable();
            $table->text('interview_notes')->nullable();
            $table->integer('score')->nullable()->comment('Interview score 0-100');
            $table->text('rejection_reason')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('application_date');
            $table->index('siswa_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recruitment_applications');
    }
};
