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
        // 1. Fix Foreign Keys in internal_payments
        Schema::table('internal_payments', function (Blueprint $table) {
            // Drop existing foreign keys that cascade (assuming standard naming)
            $table->dropForeign(['siswa_id']);
            $table->dropForeign(['item_pembayaran_id']);

            // Re-create with RESTRICT (protect data)
            $table->foreign('siswa_id')
                ->references('id')->on('siswas')
                ->onDelete('restrict');

            $table->foreign('item_pembayaran_id')
                ->references('id')->on('item_pembayaran')
                ->onDelete('restrict'); 
            
            // Add Soft Deletes for audit trail
            $table->softDeletes();
        });

        // 2. Add Job Order to Siswa Magang (Critical Logic)
        if (!Schema::hasColumn('siswa_magangs', 'job_order_id')) {
            Schema::table('siswa_magangs', function (Blueprint $table) {
                 $table->foreignId('job_order_id')->nullable()
                     ->after('siswa_id')
                     ->constrained('job_orders')
                     ->onDelete('restrict'); // Data magang jangan hilang sembarangan
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internal_payments', function (Blueprint $table) {
            $table->dropForeign(['siswa_id']);
            $table->dropForeign(['item_pembayaran_id']);
            
            // Revert to Cascade (Not recommended but for rollback)
            $table->foreign('siswa_id')->references('id')->on('siswas')->onDelete('cascade');
            $table->foreign('item_pembayaran_id')->references('id')->on('item_pembayaran')->onDelete('cascade');
            
            $table->dropSoftDeletes();
        });

        if (Schema::hasColumn('siswa_magangs', 'job_order_id')) {
            Schema::table('siswa_magangs', function (Blueprint $table) {
                $table->dropForeign(['job_order_id']);
                $table->dropColumn('job_order_id');
            });
        }
    }
};
