<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Map old permissions to new ones
        $permissionMap = [
            'finance_access' => ['finance_view'],
            'report_access' => ['report_view'],
            'siswa_access' => ['siswa_view'],
            'master_access' => [
                'kumiai_view', 
                'perusahaan_view', 
                'lpk_mitra_view', 
                'program_view', 
                'jenis_kerja_view', 
                'posisi_kerja_view'
            ],
            'task_access' => ['task_view'],
            'recruitment_access' => ['recruitment_view'],
            'document_access' => ['document_view'],
            'education_access' => ['education_view'],
        ];

        foreach ($permissionMap as $oldName => $newNames) {
            // Get old permission
            $oldPermission = DB::table('permissions')->where('name', $oldName)->first();
            
            if (!$oldPermission) {
                continue;
            }

            // Get all roles that have this old permission
            $roleIds = DB::table('permission_role')
                ->where('permission_id', $oldPermission->id)
                ->pluck('role_id')
                ->toArray();

            if (empty($roleIds)) {
                continue;
            }

            // Get new permission IDs
            $newPermissionIds = DB::table('permissions')
                ->whereIn('name', $newNames)
                ->pluck('id')
                ->toArray();

            if (empty($newPermissionIds)) {
                continue;
            }

            // Assign new permissions to roles
            foreach ($roleIds as $roleId) {
                foreach ($newPermissionIds as $newPermissionId) {
                    // Insert if not exists
                    DB::table('permission_role')->updateOrInsert(
                        ['role_id' => $roleId, 'permission_id' => $newPermissionId],
                        ['role_id' => $roleId, 'permission_id' => $newPermissionId]
                    );
                }
            }

            // Delete old permission assignments
            DB::table('permission_role')->where('permission_id', $oldPermission->id)->delete();
            
            // Delete old permission
            DB::table('permissions')->where('id', $oldPermission->id)->delete();
        }

        $this->command->info('✅ Legacy permissions migrated successfully!');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Cannot reverse this migration safely
        $this->command->warn('⚠️  This migration cannot be reversed. Old permissions are deleted.');
    }
};
