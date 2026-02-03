<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\RecruitmentApplication;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class QuickDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user if not exists
        $admin = User::firstOrCreate(
            ['email' => 'admin@lpk-sakura.id'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
            ]
        );

        $this->command->info('✅ Admin user created/verified');

        // Seed Tasks (15 tasks with varied statuses)
        $taskCount = Task::count();
        if ($taskCount < 15) {
            $taskTitles = [
                'Follow up interview with Tokyo Construction',
                'Update siswa documents for batch 5',
                'Send invoice to Kanto Kumiai',
                'Review job order applications',
                'Prepare monthly financial report',
                'Contact Osaka Food Processing for new requirements',
                'Schedule training session for new batch',
                'Update database with latest siswa information',
                'Coordinate with LPK Mitra for recruitment',
                'Verify payment from management fees',
                'Prepare presentation for kumiai meeting',
                'Review and approve leave requests',
                'Update job order status',
                'Send reminder for pending documents',
                'Organize orientation for new siswa',
            ];

            $statuses = ['pending', 'in_progress', 'completed', 'cancelled'];
            $priorities = ['low', 'medium', 'high', 'urgent'];

            foreach ($taskTitles as $index => $title) {
                Task::create([
                    'title' => $title,
                    'description' => 'Task description for: ' . $title,
                    'status' => $statuses[$index % count($statuses)],
                    'priority' => $priorities[$index % count($priorities)],
                    'created_by' => $admin->id,
                    'due_date' => now()->addDays(rand(-10, 30)),
                    'created_at' => now()->subDays(rand(1, 60)),
                ]);
            }

            $this->command->info('✅ Created ' . count($taskTitles) . ' tasks');
        } else {
            $this->command->info('ℹ️  Tasks already exist (' . $taskCount . ' tasks)');
        }

        // Seed Recruitment Applications (only if siswa exists)
        $siswaCount = Siswa::count();
        $appCount = RecruitmentApplication::count();

        if ($siswaCount > 0 && $appCount < 10) {
            $siswaList = Siswa::take(10)->get();
            $statuses = ['new', 'review', 'interview', 'accepted', 'rejected'];

            foreach ($siswaList as $index => $siswa) {
                $status = $statuses[$index % count($statuses)];
                
                RecruitmentApplication::create([
                    'application_number' => 'APP-' . date('Ym') . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                    'siswa_id' => $siswa->id,
                    'program_id' => $siswa->program_id,
                    'status' => $status,
                    'application_date' => now()->subDays(rand(1, 90)),
                    'score' => $status === 'accepted' ? rand(75, 95) : ($status === 'interview' ? rand(60, 85) : null),
                    'interview_date' => in_array($status, ['interview', 'accepted', 'rejected']) ? now()->subDays(rand(1, 30)) : null,
                    'created_at' => now()->subDays(rand(1, 90)),
                ]);
            }

            $this->command->info('✅ Created ' . count($siswaList) . ' recruitment applications');
        } else {
            if ($siswaCount === 0) {
                $this->command->warn('⚠️  No siswa found. Skipping recruitment applications.');
            } else {
                $this->command->info('ℹ️  Recruitment applications already exist (' . $appCount . ' applications)');
            }
        }

        $this->command->info('');
        $this->command->info('📊 Current Database Status:');
        $this->command->info('   - Users: ' . User::count());
        $this->command->info('   - Siswa: ' . Siswa::count());
        $this->command->info('   - Tasks: ' . Task::count());
        $this->command->info('   - Recruitment Applications: ' . RecruitmentApplication::count());
        $this->command->info('');
        $this->command->info('✅ Quick data seeding completed!');
    }
}
