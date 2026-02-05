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
        Schema::table('lpk_mitras', function (Blueprint $table) {
            if (!Schema::hasColumn('lpk_mitras', 'website')) {
                $table->string('website')->nullable();
            }
            if (!Schema::hasColumn('lpk_mitras', 'logo_url')) {
                $table->text('logo_url')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lpk_mitras', function (Blueprint $table) {
            if (Schema::hasColumn('lpk_mitras', 'website')) {
                $table->dropColumn(['website']);
            }
            if (Schema::hasColumn('lpk_mitras', 'logo_url')) {
                $table->dropColumn(['logo_url']);
            }
        });
    }
};
