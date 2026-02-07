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
        // 1. Audit Trail for Recruitment
        Schema::table('siswa_magangs', function (Blueprint $table) {
            $table->softDeletes();
            
            // 2. Prevent Duplicate Applications (DB Level Constraint)
            // Note: Make sure existing data is clean before running this
            $table->unique(['siswa_id', 'job_order_id'], 'unique_siswa_job_app');
        });

        // 3. User & Role Safety (Soft Deletes for Roles is usually overkill, but Users yes)
        Schema::table('users', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswa_magangs', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropUnique('unique_siswa_job_app');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
