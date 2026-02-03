<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Kumiai;
use App\Models\LpkMitra;
use App\Models\Perusahaan;
use App\Models\Program;
use App\Models\JenisKerja;
use App\Models\PosisiKerja;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Kumiai (Organisasi Penerima)
        $kumiai1 = Kumiai::create(['kode' => 'KUM001', 'nama' => 'ZENKOKU KUMIAI', 'email' => 'contact@zenkoku.jp']);
        $kumiai2 = Kumiai::create(['kode' => 'KUM002', 'nama' => 'JAPAN BRIDGE ASSOCIATION', 'email' => 'info@jba.or.jp']);

        // 2. LPK Mitra
        LpkMitra::create(['kode' => 'LPK001', 'nama' => 'LPK ORCHIDS INDONESIA', 'email' => 'admin@orchids.co.id']);
        LpkMitra::create(['kode' => 'LPK002', 'nama' => 'LPK JEPANG JAYA', 'email' => 'info@jepangjaya.com']);

        // 3. Perusahaan (Jepang)
        Perusahaan::create([
            'kode' => 'CO001', 
            'nama' => 'TANAKA CONSTRUCTION CO., LTD', 
            'kumiai_id' => $kumiai1->id
        ]);
        Perusahaan::create([
            'kode' => 'CO002', 
            'nama' => 'SUZUKI MANUFACTURING', 
            'kumiai_id' => $kumiai1->id
        ]);
        Perusahaan::create([
            'kode' => 'CO003', 
            'nama' => 'SATO AGRICULTURE', 
            'kumiai_id' => $kumiai2->id
        ]);

        // 4. Program
        Program::create(['kode' => 'TIT', 'nama' => 'TITP (Technical Intern Training Program)']);
        Program::create(['kode' => 'SSW', 'nama' => 'SSW (Specified Skilled Worker)']);
        Program::create(['kode' => 'EPA', 'nama' => 'EPA (Economic Partnership Agreement)']);

        // 5. Jenis Kerja
        $jk1 = JenisKerja::create(['kode' => 'KJ01', 'nama' => 'Konstruksi']);
        $jk2 = JenisKerja::create(['kode' => 'KJ02', 'nama' => 'Manufaktur']);
        $jk3 = JenisKerja::create(['kode' => 'KJ03', 'nama' => 'Pertanian']);
        $jk4 = JenisKerja::create(['kode' => 'KJ04', 'nama' => 'Pengolahan Makanan']);

        // 6. Posisi Kerja
        PosisiKerja::create(['kode' => 'P01', 'nama' => 'Tukang Besi (Rebar)', 'jenis_kerja_id' => $jk1->id]);
        PosisiKerja::create(['kode' => 'P02', 'nama' => 'Scaffolding', 'jenis_kerja_id' => $jk1->id]);
        PosisiKerja::create(['kode' => 'P03', 'nama' => 'Welding', 'jenis_kerja_id' => $jk2->id]);
        PosisiKerja::create(['kode' => 'P04', 'nama' => 'Machining', 'jenis_kerja_id' => $jk2->id]);
        PosisiKerja::create(['kode' => 'P05', 'nama' => 'Budidaya Sayuran', 'jenis_kerja_id' => $jk3->id]);
    }
}
