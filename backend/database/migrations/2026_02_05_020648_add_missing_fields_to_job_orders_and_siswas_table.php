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
        Schema::table('job_orders', function (Blueprint $table) {
            if (!Schema::hasColumn('job_orders', 'perusahaan_id')) {
                $table->foreignId('perusahaan_id')->nullable()->constrained('perusahaans')->nullOnDelete();
            }
            if (!Schema::hasColumn('job_orders', 'tanggal_job_order')) {
                $table->date('tanggal_job_order')->nullable();
            }
        });

        Schema::table('siswas', function (Blueprint $table) {
            if (!Schema::hasColumn('siswas', 'umur')) {
                $table->integer('umur')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_orders', function (Blueprint $table) {
            $table->dropForeign(['perusahaan_id']);
            $table->dropColumn(['perusahaan_id', 'tanggal_job_order']);
        });

        Schema::table('siswas', function (Blueprint $table) {
            $table->dropColumn(['umur']);
        });
    }
};
