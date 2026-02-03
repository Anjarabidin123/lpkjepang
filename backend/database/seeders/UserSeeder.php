<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define roles
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $financeRole = Role::firstOrCreate(['name' => 'finance']);
        $instructorRole = Role::firstOrCreate(['name' => 'instructor']);
        $studentRole = Role::firstOrCreate(['name' => 'student']);

        // Super Admin
        $superAdmin = User::updateOrCreate(
            ['email' => 'superadmin@lpkujc.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('1234qwer'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );
        $superAdmin->roles()->sync([$superAdminRole->id]);

        // Admin Operasional
        $admin = User::updateOrCreate(
            ['email' => 'admin@lpkujc.com'],
            [
                'name' => 'Admin Operasional',
                'password' => Hash::make('1234qwer'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );
        $admin->roles()->sync([$adminRole->id]);

        // Staff Finance
        $finance = User::updateOrCreate(
            ['email' => 'finance@lpkujc.com'],
            [
                'name' => 'Staff Finance',
                'password' => Hash::make('1234qwer'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );
        $finance->roles()->sync([$financeRole->id]);

        // Instructor Demo
        $instructor = User::updateOrCreate(
            ['email' => 'instructor@lpkujc.com'],
            [
                'name' => 'Instruktur Demo',
                'password' => Hash::make('1234qwer'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );
        $instructor->roles()->sync([$instructorRole->id]);
        
        // Student Demo
        $student = User::updateOrCreate(
            ['email' => 'student@lpkujc.com'],
            [
                'name' => 'Siswa Demo',
                'password' => Hash::make('1234qwer'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );
        $student->roles()->sync([$studentRole->id]);
    }
}
