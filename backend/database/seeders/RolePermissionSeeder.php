<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define standard permissions
        $permissions = [
            'siswa_access' => 'Akses menu data siswa dan pengelolaan siswa',
            'finance_access' => 'Akses menu keuangan, invoice, dan arus kas',
            'master_access' => 'Akses menu data master (Kumiai, LPK, Perusahaan, dll)',
            'report_access' => 'Akses menu laporan dan monitoring KPI',
            'task_access' => 'Akses menu manajemen tugas/tasks',
            'recruitment_access' => 'Akses menu rekrutmen dan aplikasi',
            'document_access' => 'Akses menu pelacakan dokumen',
            'education_access' => 'Akses menu pendidikan (Absensi, Nilai, Modul)',
        ];

        $createdPermissions = [];
        foreach ($permissions as $name => $description) {
            $createdPermissions[$name] = Permission::firstOrCreate(
                ['name' => $name],
                ['description' => $description]
            );
        }

        // Assign permissions to standard roles
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->permissions()->sync(array_values(array_map(fn($p) => $p->id, $createdPermissions)));
        }

        $financeRole = Role::where('name', 'finance')->first();
        if ($financeRole) {
            $financeRole->permissions()->sync([
                $createdPermissions['finance_access']->id,
                $createdPermissions['report_access']->id,
            ]);
        }

        $instructorRole = Role::where('name', 'instructor')->first();
        if ($instructorRole) {
            $instructorRole->permissions()->sync([
                $createdPermissions['siswa_access']->id,
                $createdPermissions['education_access']->id,
                $createdPermissions['task_access']->id,
            ]);
        }
    }
}
