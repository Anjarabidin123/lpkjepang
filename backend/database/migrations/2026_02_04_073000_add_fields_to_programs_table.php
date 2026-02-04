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
        Schema::table('programs', function (Blueprint $table) {
            if (!Schema::hasColumn('programs', 'tanggal_mulai')) {
                $table->date('tanggal_mulai')->nullable();
            }
            if (!Schema::hasColumn('programs', 'tanggal_selesai')) {
                $table->date('tanggal_selesai')->nullable();
            }
            if (!Schema::hasColumn('programs', 'durasi')) {
                $table->integer('durasi')->default(1);
            }
            if (!Schema::hasColumn('programs', 'satuan_durasi')) {
                $table->string('satuan_durasi')->default('bulan');
            }
            if (!Schema::hasColumn('programs', 'kuota')) {
                $table->integer('kuota')->default(10);
            }
            if (!Schema::hasColumn('programs', 'biaya')) {
                $table->decimal('biaya', 15, 2)->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->dropColumn(['tanggal_mulai', 'tanggal_selesai', 'durasi', 'satuan_durasi', 'kuota', 'biaya']);
        });
    }
};
