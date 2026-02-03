<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Siswa;
use App\Models\DemografiProvince;
use App\Models\DemografiRegency;

class SiswaSeeder extends Seeder
{
    public function run(): void
    {
        $jabar = DemografiProvince::where('kode', '32')->first();
        $bandung = DemografiRegency::where('nama', 'LIKE', '%KOTA BANDUNG%')->first();

        Siswa::create([
            'nama' => 'AHMAD HUDORI',
            'nik' => '3201010101010001',
            'email' => 'ahmad@example.com',
            'status' => 'Proses',
            'jenis_kelamin' => 'Laki-laki',
            'tanggal_lahir' => '2000-01-01',
            'alamat' => 'Jl. Merdeka No. 1',
            'no_hp' => '081234567890',
            'demografi_province_id' => $jabar?->id,
            'demografi_regency_id' => $bandung?->id,
        ]);

        Siswa::create([
            'nama' => 'SITI AMINAH',
            'nik' => '3201010101010002',
            'email' => 'siti@example.com',
            'status' => 'Diterima',
            'jenis_kelamin' => 'Perempuan',
            'tanggal_lahir' => '2001-05-20',
            'alamat' => 'Jl. Melati No. 5',
            'no_hp' => '081299998888',
            'demografi_province_id' => $jabar?->id,
            'demografi_regency_id' => $bandung?->id,
        ]);
    }
}
