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
            $table->integer('durasi')->nullable()->after('deskripsi');
            $table->string('satuan_durasi')->default('Bulan')->after('durasi');
            $table->decimal('biaya', 15, 2)->nullable()->after('satuan_durasi');
            $table->integer('kuota')->default(0)->after('biaya');
            $table->integer('peserta_terdaftar')->default(0)->after('kuota');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->dropColumn([
                'durasi',
                'satuan_durasi',
                'biaya',
                'kuota',
                'peserta_terdaftar'
            ]);
        });
    }
};
