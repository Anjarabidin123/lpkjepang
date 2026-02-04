<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DemografiSeeder::class,
            JapanDemografiSeeder::class,
            MasterDataSeeder::class,
            UserSeeder::class,
            RolePermissionSeeder::class,
            SiswaSeeder::class,

            RealDataSeeder::class, // Tambahkan ini agar semua data asli masuk
            DemoEducationSeeder::class,
        ]);

        // Default Admin fallback
        $admin = User::updateOrCreate(
            ['email' => 'admin@orchids.com'],
            [
                'name' => 'Admin Orchids',
                'password' => bcrypt('password'),
            ]
        );

        $superAdminRole = \App\Models\Role::where('name', 'super_admin')->first();
        if ($superAdminRole) {
            $admin->roles()->sync([$superAdminRole->id]);
        }

    }
}
