<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Siswa;
use App\Models\DocumentTracking;
use App\Models\StudentAttendance;
use App\Models\StudentGrade;
use Carbon\Carbon;

class DemoEducationSeeder extends Seeder
{
    public function run(): void
    {
        $siswas = Siswa::take(5)->get();
        if ($siswas->isEmpty()) return;

        foreach ($siswas as $index => $siswa) {
            // Seed Document Tracking
            DocumentTracking::updateOrCreate(
                ['siswa_id' => $siswa->id],
                [
                    'passport_status' => $index % 2 == 0 ? 'ready' : 'in_progress',
                    'passport_expiry' => Carbon::now()->addYears(5),
                    'mcu_status' => 'done',
                    'mcu_date' => Carbon::now()->subMonths(1),
                    'language_cert_status' => $index % 3 == 0 ? 'passed' : 'not_started',
                    'language_cert_level' => $index % 3 == 0 ? 'N4' : null,
                    'coe_status' => $index == 0 ? 'approved' : 'submitted',
                    'coe_number' => $index == 0 ? 'COE-JAP-2024-001' : null,
                    'visa_status' => $index == 0 ? 'granted' : 'not_applied',
                    'flight_status' => 'not_booked',
                    'notes' => 'Peserta sangat disiplin dalam pelatihan.'
                ]
            );

            // Seed Attendance (Last 10 days)
            for ($i = 0; $i < 10; $i++) {
                StudentAttendance::updateOrCreate(
                    ['siswa_id' => $siswa->id, 'date' => Carbon::now()->subDays($i)->format('Y-m-d')],
                    ['status' => ($i == 3) ? 'izin' : 'hadiir', 'notes' => ($i == 3) ? 'Acara keluarga' : 'Tepat waktu']
                );
            }

            // Seed Grades
            StudentGrade::create([
                'siswa_id' => $siswa->id,
                'subject' => 'Tes Hiragana & Katakana',
                'score' => rand(75, 100),
                'exam_date' => Carbon::now()->subWeeks(2),
                'result' => 'pass',
                'teacher_comments' => 'Sangat baik dalam penulisan.'
            ]);

            StudentGrade::create([
                'siswa_id' => $siswa->id,
                'subject' => 'Percakapan (Kaiwa) Dasar',
                'score' => rand(60, 95),
                'exam_date' => Carbon::now()->subWeeks(1),
                'result' => rand(0, 1) ? 'pass' : 'fail',
                'teacher_comments' => 'Perlu lebih percaya diri saat bicara.'
            ]);
        }
    }
}
