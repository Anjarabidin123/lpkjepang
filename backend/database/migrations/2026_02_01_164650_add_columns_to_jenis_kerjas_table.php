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
        Schema::table('jenis_kerjas', function (Blueprint $table) {
            $table->text('deskripsi')->nullable()->after('nama');
            $table->string('tingkat_kesulitan')->default('Menengah')->after('kategori');
            $table->string('syarat_pendidikan')->nullable()->after('tingkat_kesulitan');
            $table->decimal('gaji_minimal', 15, 2)->nullable()->after('syarat_pendidikan');
            $table->decimal('gaji_maksimal', 15, 2)->nullable()->after('gaji_minimal');
            $table->integer('total_posisi')->default(0)->after('gaji_maksimal');
            $table->string('status')->default('Aktif')->after('total_posisi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jenis_kerjas', function (Blueprint $table) {
            $table->dropColumn([
                'deskripsi',
                'tingkat_kesulitan',
                'syarat_pendidikan',
                'gaji_minimal',
                'gaji_maksimal',
                'total_posisi',
                'status'
            ]);
        });
    }
};
