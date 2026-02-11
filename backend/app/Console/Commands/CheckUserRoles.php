<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Role;

class CheckUserRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:check-roles {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and fix user roles. Usage: php artisan user:check-roles [email]';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        if ($email) {
            $this->checkSingleUser($email);
        } else {
            $this->checkAllUsers();
        }
    }

    private function checkSingleUser($email)
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User dengan email '{$email}' tidak ditemukan!");
            return;
        }

        $this->info("=== Checking User: {$user->name} ({$user->email}) ===");
        
        // Load user dengan roles
        $user->load('roles');
        
        $this->info("ID User: {$user->id}");
        
        if ($user->roles->isEmpty()) {
            $this->warn("❌ User ini TIDAK memiliki role!");
            
            if ($this->confirm('Apakah ingin assign role super_admin ke user ini?')) {
                $this->assignSuperAdmin($user);
            }
        } else {
            $this->info("✅ User memiliki role:");
            foreach ($user->roles as $role) {
                $this->line("   - {$role->name} (ID: {$role->id})");
            }
            
            // Check if user is super admin
            if ($user->roles->contains('name', 'super_admin')) {
                $this->info("✅ User adalah SUPER ADMIN");
            } else {
                $this->warn("❌ User BUKAN super admin");
                
                if ($this->confirm('Apakah ingin assign role super_admin ke user ini?')) {
                    $this->assignSuperAdmin($user);
                }
            }
        }
    }

    private function checkAllUsers()
    {
        $this->info("=== Checking All Users ===\n");
        
        $users = User::with('roles')->get();
        
        $table = [];
        foreach ($users as $user) {
            $roles = $user->roles->pluck('name')->join(', ') ?: 'TIDAK ADA ROLE';
            $isSuperAdmin = $user->roles->contains('name', 'super_admin') ? '✅' : '❌';
            
            $table[] = [
                $user->id,
                $user->name,
                $user->email,
                $roles,
                $isSuperAdmin
            ];
        }
        
        $this->table(
            ['ID', 'Nama', 'Email', 'Roles', 'Super Admin?'],
            $table
        );
        
        // Check for users without roles
        $usersWithoutRoles = $users->filter(fn($u) => $u->roles->isEmpty());
        
        if ($usersWithoutRoles->isNotEmpty()) {
            $this->warn("\n⚠️  Ditemukan {$usersWithoutRoles->count()} user tanpa role!");
            $this->warn("Jalankan: php artisan user:check-roles [email] untuk fix");
        }
    }

    private function assignSuperAdmin($user)
    {
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin']);
        
        // Sync akan mengganti semua role dengan super_admin saja
        // Jika ingin menambahkan tanpa menghapus role lain, gunakan attach
        $user->roles()->syncWithoutDetaching([$superAdminRole->id]);
        
        $this->info("✅ Role super_admin berhasil di-assign ke {$user->email}");
        
        // Verify
        $user->load('roles');
        $this->info("Role user sekarang: " . $user->roles->pluck('name')->join(', '));
    }
}
