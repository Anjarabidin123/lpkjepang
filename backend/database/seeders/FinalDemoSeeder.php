<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Siswa;
use App\Models\DocumentTracking;
use App\Models\StudentAttendance;
use App\Models\StudentGrade;
use Carbon\Carbon;

class FinalDemoSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Pastikan Siswa dengan email demo ada
        $siswa = Siswa::updateOrCreate(
            ['email' => 'student@lpkujc.com'],
            [
                'nama' => 'Budi Santoso (Demo Student)',
                'nik' => '3201010101010999',
                'jenis_kelamin' => 'L',
                'tanggal_lahir' => '2000-01-01',
                'alamat' => 'Jl. Demo No. 123',
                'no_hp' => '08123456789',
                'status' => 'Aktif'
            ]
        );

        // 2. Tambahkan Tracking Dokumen
        DocumentTracking::updateOrCreate(
            ['siswa_id' => $siswa->id],
            [
                'passport_status' => 'ready',
                'passport_expiry' => Carbon::now()->addYears(4),
                'mcu_status' => 'done',
                'mcu_date' => Carbon::now()->subMonths(1),
                'language_cert_status' => 'passed',
                'language_cert_level' => 'N4',
                'coe_status' => 'approved',
                'coe_number' => 'COE-999-DEMO',
                'visa_status' => 'granted',
                'flight_status' => 'booked',
                'departure_datetime' => Carbon::now()->addWeeks(2),
                'notes' => 'Siswa teladan, siap berangkat.'
            ]
        );

        // 3. Tambahkan Absensi (30 hari terakhir)
        for ($i = 0; $i < 15; $i++) {
            $status = 'hadiir';
            if ($i == 5) $status = 'izin';
            if ($i == 12) $status = 'sakit';

            StudentAttendance::updateOrCreate(
                ['siswa_id' => $siswa->id, 'date' => Carbon::now()->subDays($i)->format('Y-m-d')],
                ['status' => $status, 'notes' => 'Pelatihan harian']
            );
        }

        // 4. Tambahkan Nilai
        StudentGrade::updateOrCreate(
            ['siswa_id' => $siswa->id, 'subject' => 'Ujian Akhir Hiragana'],
            ['score' => 95, 'exam_date' => Carbon::now()->subMonths(2), 'result' => 'pass', 'teacher_comments' => 'Sangat mahir']
        );
        
        StudentGrade::updateOrCreate(
            ['siswa_id' => $siswa->id, 'subject' => 'Nihongo Bunpou (Tata Bahasa)'],
            ['score' => 88, 'exam_date' => Carbon::now()->subMonths(1), 'result' => 'pass', 'teacher_comments' => 'Memahami pola kalimat dengan baik']
        );

        StudentGrade::updateOrCreate(
            ['siswa_id' => $siswa->id, 'subject' => 'Simulasi Tes JFT-Basic'],
            ['score' => 78, 'exam_date' => Carbon::now()->subWeeks(1), 'result' => 'pass', 'teacher_comments' => 'Lulus ambang batas']
        );
    }
}
