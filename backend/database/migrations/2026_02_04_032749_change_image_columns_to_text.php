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
        Schema::table('siswa_magangs', function (Blueprint $table) {
            $table->text('avatar_url')->nullable()->change();
        });

        Schema::table('siswas', function (Blueprint $table) {
            $table->text('foto_siswa')->nullable()->change();
            $table->text('foto_url')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswa_magangs', function (Blueprint $table) {
            $table->string('avatar_url')->nullable()->change();
        });

        Schema::table('siswas', function (Blueprint $table) {
            $table->string('foto_siswa')->nullable()->change();
            $table->string('foto_url')->nullable()->change();
        });
    }
};
