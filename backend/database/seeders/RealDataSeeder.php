<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Siswa;
use App\Models\SiswaMagang;
use App\Models\Kumiai;
use App\Models\Perusahaan;
use App\Models\LpkMitra;
use App\Models\Program;
use App\Models\JenisKerja;
use App\Models\PosisiKerja;
use App\Models\JobOrder;
use App\Models\Invoice;
use App\Models\ArusKas;
use App\Models\KategoriPemasukan;
use App\Models\KategoriPengeluaran;
use App\Models\Task;
use App\Models\RecruitmentApplication;
use Illuminate\Support\Facades\Hash;

class RealDataSeeder extends Seeder
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
        
        $superAdminRole = \App\Models\Role::where('name', 'super_admin')->first();
        if ($superAdminRole) {
            $admin->roles()->syncWithoutDetaching([$superAdminRole->id]);
        }

        // Seed Programs
        $programs = [
            ['nama' => 'Ginou Jisshuusei (TITP)', 'kode' => 'GJ', 'deskripsi' => 'Program magang teknis ke Jepang', 'durasi' => 36],
            ['nama' => 'Tokutei Ginou (SSW)', 'kode' => 'TG', 'deskripsi' => 'Program pekerja terampil khusus', 'durasi' => 60],
            ['nama' => 'Internship', 'kode' => 'INT', 'deskripsi' => 'Program magang mahasiswa', 'durasi' => 12],
        ];

        foreach ($programs as $program) {
            Program::firstOrCreate(['kode' => $program['kode']], $program);
        }

        // Seed Jenis Kerja
        $jenisKerja = [
            ['nama' => 'Konstruksi', 'kode' => 'KON', 'deskripsi' => 'Pekerjaan bidang konstruksi'],
            ['nama' => 'Pertanian', 'kode' => 'PTN', 'deskripsi' => 'Pekerjaan bidang pertanian'],
            ['nama' => 'Manufaktur', 'kode' => 'MNF', 'deskripsi' => 'Pekerjaan bidang manufaktur'],
            ['nama' => 'Perawatan (Kaigo)', 'kode' => 'PRW', 'deskripsi' => 'Pekerjaan bidang perawatan'],
            ['nama' => 'Jasa & Pelayanan', 'kode' => 'JSA', 'deskripsi' => 'Bidang jasa dan hospitality'],
        ];

        foreach ($jenisKerja as $jk) {
            JenisKerja::firstOrCreate(['kode' => $jk['kode']], $jk);
        }

        // Seed Kumiai
        $kumiaiData = [
            [
                'nama' => 'Kanto Kyodo Kumiai',
                'kode' => 'KKK',
                'alamat' => 'Shinjuku-ku, Tokyo, Japan',
                'email' => 'info@kanto-kumiai.or.jp',
                'pic_nama' => 'Tanaka Sato',
                'pic_telepon' => '+81-90-1122-3344',
            ],
            [
                'nama' => 'Kansai Support Association',
                'kode' => 'KSA',
                'alamat' => 'Chuo-ku, Osaka, Japan',
                'email' => 'contact@kansai-support.jp',
                'pic_nama' => 'Yamamoto Kenji',
                'pic_telepon' => '+81-80-9988-7766',
            ],
        ];

        foreach ($kumiaiData as $kumiai) {
            Kumiai::firstOrCreate(['kode' => $kumiai['kode']], $kumiai);
        }

        // Seed LPK Mitra
        $lpkData = [
            [
                'nama' => 'LPK Global Indonesia',
                'kode' => 'LGI',
                'alamat' => 'Jakarta Selatan, DKI Jakarta',
                'phone' => '021-7788990',
                'email' => 'info@global-indonesia.com',
                'pic_nama' => 'Budi Santoso',
                'status' => 'Aktif',
            ],
            [
                'nama' => 'LPK Bakti Nusantara',
                'kode' => 'LBN',
                'alamat' => 'Bandung, Jawa Barat',
                'phone' => '022-4455667',
                'email' => 'admin@baktinusantara.id',
                'pic_nama' => 'Siti Aminah',
                'status' => 'Aktif',
            ],
        ];

        foreach ($lpkData as $lpk) {
            LpkMitra::firstOrCreate(['kode' => $lpk['kode']], $lpk);
        }

        // Seed Perusahaan
        $kumiaiList = Kumiai::all();
        $perusahaanData = [
            [
                'nama' => 'Tokyo Construction Co.',
                'kode' => 'TCC',
                'alamat' => 'Shibuya, Tokyo',
                'kumiai_id' => $kumiaiList[0]->id ?? null,
                'email' => 'hiring@tokyo-const.jp',
            ],
            [
                'nama' => 'Osaka Food Processing Ltd.',
                'kode' => 'OFP',
                'alamat' => 'Namba, Osaka',
                'kumiai_id' => $kumiaiList[1]->id ?? null,
                'email' => 'info@osaka-food.jp',
            ],
        ];

        foreach ($perusahaanData as $perusahaan) {
            Perusahaan::firstOrCreate(['kode' => $perusahaan['kode']], $perusahaan);
        }

        // Seed Siswa
        $programList = Program::all();
        $lpkList = LpkMitra::all();
        
        $siswaData = [
            ['nama' => 'Ahmad Fauzi', 'nik' => '3273011234567890', 'email' => 'ahmad.fauzi@example.com', 'status' => 'Magang'],
            ['nama' => 'Siti Aminah', 'nik' => '3273011234567891', 'email' => 'siti.aminah@example.com', 'status' => 'Pelatihan'],
            ['nama' => 'Bambang Susanto', 'nik' => '3273011234567892', 'email' => 'bambang.susanto@example.com', 'status' => 'Matching'],
            ['nama' => 'Rizky Ramadhan', 'nik' => '3273011234567893', 'email' => 'rizky.ramadhan@example.com', 'status' => 'Magang'],
            ['nama' => 'Indah Permata', 'nik' => '3273011234567894', 'email' => 'indah.permata@example.com', 'status' => 'Proses'],
            ['nama' => 'Joko Prasetyo', 'nik' => '3273011234567895', 'email' => 'joko.prasetyo@example.com', 'status' => 'Magang'],
            ['nama' => 'Maya Kartika', 'nik' => '3273011234567896', 'email' => 'maya.kartika@example.com', 'status' => 'Pelatihan'],
            ['nama' => 'Agus Setiawan', 'nik' => '3273011234567897', 'email' => 'agus.setiawan@example.com', 'status' => 'Matching'],
            ['nama' => 'Rina Wijaya', 'nik' => '3273011234567898', 'email' => 'rina.wijaya@example.com', 'status' => 'Magang'],
            ['nama' => 'Hendra Gunawan', 'nik' => '3273011234567899', 'email' => 'hendra.gunawan@example.com', 'status' => 'Selesai'],
        ];

        foreach ($siswaData as $index => $siswa) {
            Siswa::firstOrCreate(
                ['nik' => $siswa['nik']],
                array_merge($siswa, [
                    'program_id' => $programList[$index % $programList->count()]->id ?? null,
                    'lpk_mitra_id' => $lpkList[$index % $lpkList->count()]->id ?? null,
                    'tempat_lahir' => 'Jakarta',
                    'tanggal_lahir' => '1998-01-01',
                    'jenis_kelamin' => $index % 2 == 0 ? 'Laki-laki' : 'Perempuan',
                    'alamat' => 'Jl. Contoh No. ' . ($index + 1),
                    'tanggal_daftar' => now()->subMonths(rand(1, 12)),
                ])
            );
        }

        // Seed Siswa Magang
        $siswaList = Siswa::whereIn('status', ['Magang', 'Selesai'])->get();
        $perusahaanList = Perusahaan::all();
        $jenisKerjaList = JenisKerja::all();

        foreach ($siswaList as $index => $siswa) {
            SiswaMagang::firstOrCreate(
                ['siswa_id' => $siswa->id],
                [
                    'kumiai_id' => $kumiaiList[$index % $kumiaiList->count()]->id ?? null,
                    'perusahaan_id' => $perusahaanList[$index % $perusahaanList->count()]->id ?? null,
                    'program_id' => $siswa->program_id,
                    'jenis_kerja_id' => $jenisKerjaList[$index % $jenisKerjaList->count()]->id ?? null,
                    'lpk_mitra_id' => $siswa->lpk_mitra_id,
                    'status_magang' => $siswa->status === 'Selesai' ? 'Selesai' : 'Aktif',
                    'gaji' => 160000 + ($index * 5000),
                    'tanggal_mulai_kerja' => now()->subMonths(rand(1, 24)),
                    'lokasi' => $index % 2 == 0 ? 'Tokyo' : 'Osaka',
                ]
            );
        }

        // Seed Job Orders
        foreach ($kumiaiList as $index => $kumiai) {
            JobOrder::firstOrCreate(
                ['nama_job_order' => 'Caregiver Tokyo 2024 - ' . $kumiai->kode],
                [
                    'kuota' => 10,
                    'status' => 'Aktif',
                    'catatan' => 'Urgent requirement for elderly care',
                    'kumiai_id' => $kumiai->id,
                    'jenis_kerja_id' => $jenisKerjaList->where('kode', 'PRW')->first()->id ?? null,
                ]
            );
        }

        // Seed Kategori Pemasukan & Pengeluaran
        $kategoriPemasukan = [
            ['nama_kategori' => 'Biaya Pendaftaran', 'deskripsi' => 'Pendaftaran awal siswa'],
            ['nama_kategori' => 'Management Fee', 'deskripsi' => 'Biaya pengelolaan dari Kumiai'],
        ];

        foreach ($kategoriPemasukan as $kat) {
            KategoriPemasukan::firstOrCreate(['nama_kategori' => $kat['nama_kategori']], $kat);
        }

        $kategoriPengeluaran = [
            ['nama_kategori' => 'Gaji Karyawan', 'deskripsi' => 'Gaji staff internal'],
            ['nama_kategori' => 'Operasional Kantor', 'deskripsi' => 'Listrik, air, internet'],
        ];

        foreach ($kategoriPengeluaran as $kat) {
            KategoriPengeluaran::firstOrCreate(['nama_kategori' => $kat['nama_kategori']], $kat);
        }

        // Seed Arus Kas
        $katPemasukan = KategoriPemasukan::first();
        $katPengeluaran = KategoriPengeluaran::first();

        for ($i = 0; $i < 10; $i++) {
            ArusKas::create([
                'tanggal' => now()->subDays(rand(1, 90)),
                'jenis' => $i % 2 == 0 ? 'Pemasukan' : 'Pengeluaran',
                'kategori' => $i % 2 == 0 ? $katPemasukan->nama_kategori : $katPengeluaran->nama_kategori,
                'nominal' => rand(1000000, 10000000),
                'keterangan' => 'Transaksi ' . ($i + 1),
            ]);
        }

        // Seed Tasks
        for ($i = 0; $i < 15; $i++) {
            Task::create([
                'title' => 'Task ' . ($i + 1) . ': ' . ['Follow up interview', 'Update documents', 'Send invoice', 'Review application'][$i % 4],
                'description' => 'Description for task ' . ($i + 1),
                'status' => ['pending', 'in_progress', 'completed'][$i % 3],
                'priority' => ['low', 'medium', 'high', 'urgent'][$i % 4],
                'created_by' => $admin->id,
                'due_date' => now()->addDays(rand(-5, 30)),
            ]);
        }

        // Seed Recruitment Applications
        $siswaForRecruitment = Siswa::whereIn('status', ['Proses', 'Matching'])->take(5)->get();
        
        foreach ($siswaForRecruitment as $index => $siswa) {
            $appNumber = 'APP-' . date('Ym') . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT);
            RecruitmentApplication::firstOrCreate(
                ['application_number' => $appNumber],
                [
                    'siswa_id' => $siswa->id,
                    'program_id' => $siswa->program_id,
                    'status' => ['new', 'review', 'interview', 'accepted'][$index % 4],
                    'application_date' => now()->subDays(rand(1, 60)),
                    'score' => $index % 4 == 3 ? rand(70, 95) : null,
                ]
            );
        }

        $this->command->info('✅ Real data seeded successfully!');
        $this->command->info('📊 Created:');
        $this->command->info('   - ' . Siswa::count() . ' Siswa');
        $this->command->info('   - ' . SiswaMagang::count() . ' Siswa Magang');
        $this->command->info('   - ' . JobOrder::count() . ' Job Orders');
        $this->command->info('   - ' . Task::count() . ' Tasks');
        $this->command->info('   - ' . RecruitmentApplication::count() . ' Applications');
        $this->command->info('   - ' . ArusKas::count() . ' Arus Kas transactions');
    }
}
