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
            SiswaSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Admin Orchids',
            'email' => 'admin@orchids.com',
            'password' => bcrypt('password'),
        ]);
    }
}
