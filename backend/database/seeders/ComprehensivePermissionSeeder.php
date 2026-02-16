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
        // Define comprehensive permissions based on frontend modules
        $permissionsData = [
            // Detailed Permissions by Module
            // Siswa Management
            ['name' => 'siswa_view', 'description' => 'Lihat data siswa'],
            ['name' => 'siswa_create', 'description' => 'Buat data siswa baru'],
            ['name' => 'siswa_update', 'description' => 'Edit data siswa'],
            ['name' => 'siswa_delete', 'description' => 'Hapus data siswa'],
            ['name' => 'siswa_manage', 'description' => 'Kelola semua data siswa'],
            
            // Kumiai Management
            ['name' => 'kumiai_view', 'description' => 'Lihat data kumiai'],
            ['name' => 'kumiai_create', 'description' => 'Buat kumiai baru'],
            ['name' => 'kumiai_update', 'description' => 'Edit data kumiai'],
            ['name' => 'kumiai_delete', 'description' => 'Hapus kumiai'],
            
            // Perusahaan Management
            ['name' => 'perusahaan_view', 'description' => 'Lihat data perusahaan'],
            ['name' => 'perusahaan_create', 'description' => 'Buat perusahaan baru'],
            ['name' => 'perusahaan_update', 'description' => 'Edit data perusahaan'],
            ['name' => 'perusahaan_delete', 'description' => 'Hapus perusahaan'],
            
            // LPK Mitra Management
            ['name' => 'lpk_mitra_view', 'description' => 'Lihat data LPK mitra'],
            ['name' => 'lpk_mitra_create', 'description' => 'Buat LPK mitra baru'],
            ['name' => 'lpk_mitra_update', 'description' => 'Edit data LPK mitra'],
            ['name' => 'lpk_mitra_delete', 'description' => 'Hapus LPK mitra'],
            
            // Program Management
            ['name' => 'program_view', 'description' => 'Lihat data program'],
            ['name' => 'program_create', 'description' => 'Buat program baru'],
            ['name' => 'program_update', 'description' => 'Edit data program'],
            ['name' => 'program_delete', 'description' => 'Hapus program'],
            
            // Jenis Kerja Management
            ['name' => 'jenis_kerja_view', 'description' => 'Lihat jenis kerja'],
            ['name' => 'jenis_kerja_create', 'description' => 'Buat jenis kerja baru'],
            ['name' => 'jenis_kerja_update', 'description' => 'Edit jenis kerja'],
            ['name' => 'jenis_kerja_delete', 'description' => 'Hapus jenis kerja'],
            
            // Posisi Kerja Management
            ['name' => 'posisi_kerja_view', 'description' => 'Lihat posisi kerja'],
            ['name' => 'posisi_kerja_create', 'description' => 'Buat posisi kerja baru'],
            ['name' => 'posisi_kerja_update', 'description' => 'Edit posisi kerja'],
            ['name' => 'posisi_kerja_delete', 'description' => 'Hapus posisi kerja'],
            
            // Job Order Management
            ['name' => 'job_order_view', 'description' => 'Lihat job order'],
            ['name' => 'job_order_create', 'description' => 'Buat job order baru'],
            ['name' => 'job_order_update', 'description' => 'Edit job order'],
            ['name' => 'job_order_delete', 'description' => 'Hapus job order'],
            
            // Task Management
            ['name' => 'task_view', 'description' => 'Lihat tugas'],
            ['name' => 'task_create', 'description' => 'Buat tugas baru'],
            ['name' => 'task_update', 'description' => 'Edit tugas'],
            ['name' => 'task_delete', 'description' => 'Hapus tugas'],
            
            // Recruitment Management
            ['name' => 'recruitment_view', 'description' => 'Lihat data rekrutmen'],
            ['name' => 'recruitment_create', 'description' => 'Buat rekrutmen baru'],
            ['name' => 'recruitment_update', 'description' => 'Edit rekrutmen'],
            ['name' => 'recruitment_delete', 'description' => 'Hapus rekrutmen'],
            
            // Document Management
            ['name' => 'document_view', 'description' => 'Lihat dokumen'],
            ['name' => 'document_create', 'description' => 'Upload dokumen'],
            ['name' => 'document_update', 'description' => 'Edit dokumen'],
            ['name' => 'document_delete', 'description' => 'Hapus dokumen'],
            ['name' => 'document_manage', 'description' => 'Kelola semua dokumen'],
            
            // Finance Management
            ['name' => 'finance_view', 'description' => 'Lihat data keuangan, invoice, dan arus kas'],
            ['name' => 'finance_create', 'description' => 'Buat transaksi keuangan'],
            ['name' => 'finance_update', 'description' => 'Edit transaksi keuangan'],
            ['name' => 'finance_delete', 'description' => 'Hapus transaksi keuangan'],
            
            // Education Management  
            ['name' => 'education_view', 'description' => 'Lihat data pendidikan'],
            ['name' => 'education_create', 'description' => 'Buat data pendidikan'],
            ['name' => 'education_update', 'description' => 'Edit data pendidikan'],
            ['name' => 'education_delete', 'description' => 'Hapus data pendidikan'],
            ['name' => 'education_manage', 'description' => 'Kelola semua data pendidikan'],
            
            // Report Management
            ['name' => 'report_view', 'description' => 'Lihat laporan dan monitoring KPI'],
            ['name' => 'report_generate', 'description' => 'Generate laporan'],
            ['name' => 'report_export', 'description' => 'Export laporan'],
            
            // User Management
            ['name' => 'user_view', 'description' => 'Lihat data user'],
            ['name' => 'user_create', 'description' => 'Buat user baru'],
            ['name' => 'user_update', 'description' => 'Edit user'],
            ['name' => 'user_delete', 'description' => 'Hapus user'],
            ['name' => 'user_assign_roles', 'description' => 'Assign role ke user'],
            
            // Role Management
            ['name' => 'role_view', 'description' => 'Lihat data role'],
           ['name' => 'role_create', 'description' => 'Buat role baru'],
            ['name' => 'role_update', 'description' => 'Edit role'],
            ['name' => 'role_delete', 'description' => 'Hapus role'],
            ['name' => 'role_assign_permissions', 'description' => 'Assign permission ke role'],
        ];

        foreach ($permissionsData as $permData) {
            Permission::firstOrCreate(
                ['name' => $permData['name']],
                ['description' => $permData['description']]
            );
        }

        $this->command->info('✅ ' . count($permissionsData) . ' permissions created/verified successfully!');
    }
}
