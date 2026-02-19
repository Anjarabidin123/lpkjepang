<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class ComprehensivePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Define Legacy Access Permissions (Required by Middleware & Controllers)
        $legacyAccess = [
            'siswa_access' => 'Akses utama Modul Siswa & Rekrutmen',
            'finance_access' => 'Akses utama Modul Keuangan (Transaksi, Arus Kas, Invoice)',
            'master_access' => 'Akses utama Modul Master Data Utama',
            'report_access' => 'Akses utama Modul Laporan & Monitoring KPI',
            'task_access' => 'Akses utama Modul Tugas/Task',
            'recruitment_access' => 'Akses utama Modul Rekrutmen',
            'document_access' => 'Akses utama Modul Manajemen Dokumen',
            'education_access' => 'Akses utama Modul Pendidikan & Magang',
        ];

        foreach ($legacyAccess as $name => $desc) {
            Permission::updateOrCreate(
                ['name' => $name],
                ['description' => $desc]
            );
        }

        // 2. Define Granular Permissions for each module
        $actions = ['view', 'create', 'update', 'delete', 'manage'];
        
        $modules = [
            // Master Data
            'siswa', 'kumiai', 'perusahaan', 'lpk_mitra', 'program', 'jenis_kerja', 'posisi_kerja', 'siswa_magang',
            // Operasional
            'job_order', 'tugas', 'rekrutmen', 'monitoring', 'dashboard',
            // Transaksi
            'internal_payment', 'invoice', 'arus_kas', 'pengaturan', 'laporan_keuangan',
            // System
            'user_management', 'role_management', 'system_management'
        ];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::updateOrCreate(
                    ['name' => "{$module}_{$action}"],
                    ['description' => strtoupper($action) . " permission for " . str_replace('_', ' ', $module)]
                );
            }
        }

        // 3. Add specialized permissions
        $specialized = [
            ['name' => 'report_generate', 'description' => 'Generate reports'],
            ['name' => 'report_export', 'description' => 'Export reports'],
            ['name' => 'user_assign_roles', 'description' => 'Assign roles to users'],
            ['name' => 'role_assign_permissions', 'description' => 'Assign permissions to roles'],
        ];

        foreach ($specialized as $permData) {
            Permission::updateOrCreate(
                ['name' => $permData['name']],
                ['description' => $permData['description']]
            );
        }

        $this->command->info('✅ RBAC synchronization complete!');
    }
}
