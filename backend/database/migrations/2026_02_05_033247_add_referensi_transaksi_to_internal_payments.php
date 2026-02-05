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
        Schema::table('internal_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('internal_payments', 'referensi_transaksi')) {
                $table->string('referensi_transaksi')->nullable()->after('metode_pembayaran');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internal_payments', function (Blueprint $table) {
            if (Schema::hasColumn('internal_payments', 'referensi_transaksi')) {
                $table->dropColumn('referensi_transaksi');
            }
        });
    }
};
