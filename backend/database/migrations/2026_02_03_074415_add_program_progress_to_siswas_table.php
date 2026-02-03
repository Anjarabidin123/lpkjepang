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
        Schema::table('siswas', function (Blueprint $table) {
            $table->string('current_process_name')->nullable()->after('status')->comment('Nama proses saat ini, misal: Persiapan CoE');
            $table->integer('current_step')->default(0)->after('current_process_name');
            $table->integer('total_steps')->default(0)->after('current_step');
            $table->date('target_completion_date')->nullable()->after('total_steps');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswas', function (Blueprint $table) {
            $table->dropColumn(['current_process_name', 'current_step', 'total_steps', 'target_completion_date']);
        });
    }
};
