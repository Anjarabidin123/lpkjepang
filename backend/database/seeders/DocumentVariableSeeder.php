<?php

namespace Database\Seeders;

use App\Models\DocumentVariable;
use Illuminate\Database\Seeder;

class DocumentVariableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $variables = [
            // Siswa variables
            ['nama' => 'siswa_nama', 'display_name' => 'Nama Lengkap Siswa', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'nama', 'format_type' => 'text'],
            ['nama' => 'siswa_nama_upper', 'display_name' => 'Nama Siswa (Kapital)', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'nama', 'format_type' => 'uppercase'],
            ['nama' => 'siswa_nik', 'display_name' => 'NIK Siswa', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'nik', 'format_type' => 'text'],
            ['nama' => 'siswa_tempat_lahir', 'display_name' => 'Tempat Lahir', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'tempat_lahir', 'format_type' => 'text'],
            ['nama' => 'siswa_tanggal_lahir', 'display_name' => 'Tanggal Lahir', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'tanggal_lahir', 'format_type' => 'date'],
            ['nama' => 'siswa_tanggal_lahir_jp', 'display_name' => 'Tanggal Lahir (JP)', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'tanggal_lahir', 'format_type' => 'date_jp'],
            ['nama' => 'siswa_alamat', 'display_name' => 'Alamat Siswa', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'alamat', 'format_type' => 'text'],
            ['nama' => 'siswa_jenis_kelamin', 'display_name' => 'Jenis Kelamin', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'jenis_kelamin', 'format_type' => 'text'],
            ['nama' => 'siswa_no_paspor', 'display_name' => 'Nomor Paspor', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'no_paspor', 'format_type' => 'text'],
            ['nama' => 'siswa_email', 'display_name' => 'Email Siswa', 'kategori' => 'siswa', 'source_table' => 'siswas', 'source_field' => 'email', 'format_type' => 'text'],
            ['nama' => 'siswa_no_hp', 'display_name' => 'No. HP Siswa', 'kategori' => 'siswa', 'source_table' => 'users', 'source_field' => 'phone', 'format_type' => 'phone'],
            
            // Perusahaan variables
            ['nama' => 'perusahaan_nama', 'display_name' => 'Nama Perusahaan', 'kategori' => 'perusahaan', 'source_table' => 'perusahaans', 'source_field' => 'nama', 'format_type' => 'text'],
            ['nama' => 'perusahaan_alamat', 'display_name' => 'Alamat Perusahaan', 'kategori' => 'perusahaan', 'source_table' => 'perusahaans', 'source_field' => 'alamat', 'format_type' => 'text'],
            ['nama' => 'perusahaan_telepon', 'display_name' => 'Telepon Perusahaan', 'kategori' => 'perusahaan', 'source_table' => 'perusahaans', 'source_field' => 'telepon', 'format_type' => 'phone'],
            
            // Kumiai variables
            ['nama' => 'kumiai_nama', 'display_name' => 'Nama Kumiai', 'kategori' => 'kumiai', 'source_table' => 'kumiais', 'source_field' => 'nama', 'format_type' => 'text'],
            ['nama' => 'kumiai_alamat', 'display_name' => 'Alamat Kumiai', 'kategori' => 'kumiai', 'source_table' => 'kumiais', 'source_field' => 'alamat', 'format_type' => 'text'],
            
            // Program variables
            ['nama' => 'program_nama', 'display_name' => 'Nama Program', 'kategori' => 'program', 'source_table' => 'programs', 'source_field' => 'nama', 'format_type' => 'text'],
            ['nama' => 'program_durasi', 'display_name' => 'Durasi Program', 'kategori' => 'program', 'source_table' => 'programs', 'source_field' => 'durasi_bulan', 'format_type' => 'number'],
            
            // LPK variables
            ['nama' => 'lpk_nama', 'display_name' => 'Nama LPK', 'kategori' => 'lpk', 'source_table' => 'profil_lpks', 'source_field' => 'nama_lpk', 'format_type' => 'text'],
            ['nama' => 'lpk_alamat', 'display_name' => 'Alamat LPK', 'kategori' => 'lpk', 'source_table' => 'profil_lpks', 'source_field' => 'alamat', 'format_type' => 'text'],
            ['nama' => 'lpk_direktur', 'display_name' => 'Direktur LPK', 'kategori' => 'lpk', 'source_table' => 'profil_lpks', 'source_field' => 'nama_direktur', 'format_type' => 'text'],
            
            // System variables
            ['nama' => 'tanggal_hari_ini', 'display_name' => 'Tanggal Hari Ini', 'kategori' => 'sistem', 'source_table' => '_system', 'source_field' => 'current_date', 'format_type' => 'date'],
            ['nama' => 'tanggal_hari_ini_jp', 'display_name' => 'Tanggal Hari Ini (JP)', 'kategori' => 'sistem', 'source_table' => '_system', 'source_field' => 'current_date', 'format_type' => 'date_jp'],
            ['nama' => 'tahun_sekarang', 'display_name' => 'Tahun Sekarang', 'kategori' => 'sistem', 'source_table' => '_system', 'source_field' => 'current_year', 'format_type' => 'text'],
        ];

        foreach ($variables as $variable) {
            DocumentVariable::updateOrCreate(['nama' => $variable['nama']], $variable);
        }
    }
}
