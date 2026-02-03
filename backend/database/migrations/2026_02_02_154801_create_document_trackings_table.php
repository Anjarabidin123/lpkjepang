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
        Schema::create('document_trackings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswas')->onDelete('cascade');
            
            // Status untuk masing-masing dokumen krusial
            $table->enum('passport_status', ['not_started', 'in_progress', 'ready', 'expired'])->default('not_started');
            $table->date('passport_expiry')->nullable();
            
            $table->enum('mcu_status', ['not_started', 'done', 'expired'])->default('not_started');
            $table->date('mcu_date')->nullable();
            
            $table->enum('language_cert_status', ['not_started', 'not_passed', 'passed'])->default('not_started');
            $table->string('language_cert_level')->nullable(); // N5, N4, etc.
            
            $table->enum('coe_status', ['not_submitted', 'submitted', 'approved', 'rejected'])->default('not_submitted');
            $table->string('coe_number')->nullable();
            $table->date('coe_issue_date')->nullable();
            
            $table->enum('visa_status', ['not_applied', 'applied', 'granted', 'denied'])->default('not_applied');
            $table->date('visa_expiry')->nullable();
            
            $table->enum('flight_status', ['not_booked', 'booked', 'departed'])->default('not_booked');
            $table->dateTime('departure_datetime')->nullable();
            
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_trackings');
    }
};
