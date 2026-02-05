<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, the easiest way to fix a check constraint is to 
        // replace the column or recreate the table.
        // Since this is a demo, we'll try to be safe.
        
        if (Schema::hasColumn('student_attendances', 'status')) {
            // we'll change it to a simple string first to bypass the enum constraint
            // In SQLite, change() often requires recreating the table internally by Laravel
            Schema::table('student_attendances', function (Blueprint $table) {
                // Drop and re-add is safest for SQLite enum changes if we don't mind data loss
                // OR we can try to rename it.
                $table->string('new_status')->default('hadir')->after('status');
            });

            DB::table('student_attendances')->update([
                'new_status' => DB::raw("CASE WHEN status = 'hadiir' THEN 'hadir' ELSE status END")
            ]);

            Schema::table('student_attendances', function (Blueprint $table) {
                $table->dropColumn('status');
            });

            Schema::table('student_attendances', function (Blueprint $table) {
                $table->renameColumn('new_status', 'status');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_attendances', function (Blueprint $table) {
            $table->string('old_status')->default('hadiir')->after('status');
        });

        DB::table('student_attendances')->update([
            'old_status' => DB::raw("CASE WHEN status = 'hadir' THEN 'hadiir' ELSE status END")
        ]);

        Schema::table('student_attendances', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('student_attendances', function (Blueprint $table) {
            $table->renameColumn('old_status', 'status');
        });
    }
};
