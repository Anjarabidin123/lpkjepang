
export interface Siswa {
  id: string;
  nama: string;
  nik: string;
  tanggal_lahir?: string | null;
  tempat_lahir?: string | null;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan' | null;
  foto_siswa?: string | null;
  alamat?: string | null;
  telepon?: string | null;
  email?: string | null;
  tinggi_badan?: number | null;
  berat_badan?: number | null;
  ukuran_sepatu?: number | null;
  golongan_darah?: string | null;
  status_pernikahan?: string | null;
  agama?: string | null;
  hobi?: string | null;
  visi?: string | null;
  target_gaji?: string | null;
  pengalaman_jepang?: string | null;
  skill_bahasa_jepang?: string | null;
  status?: 'Aktif' | 'Diterima' | 'Proses' | 'Ditolak';
  program_id?: string | null;
  posisi_kerja_id?: string | null;
  lpk_mitra_id?: string | null;
  tanggal_daftar?: string | null;
  foto_url?: string | null;
  nama_sekolah?: string | null;
  tahun_masuk_sekolah?: number | null;
  tahun_lulus_sekolah?: number | null;
  jurusan?: string | null;
  umur?: number | null;
  mata_kanan?: string | null;
  mata_kiri?: string | null;
  ukuran_kepala?: number | null;
  ukuran_pinggang?: number | null;
  merokok_sekarang?: string | null;
  merokok_jepang?: string | null;
  minum_sake?: string | null;
  penggunaan_tangan?: string | null;
  buta_warna?: boolean | null;
  warna_buta?: string | null;
  bakat_khusus?: string | null;
  kelebihan?: string | null;
  kekurangan?: string | null;
  pengalaman?: string | null;
  minat?: string | null;
  tujuan_jepang?: string | null;
  target_menabung?: string | null;
  tanggal_masuk_lpk?: string | null;
  lama_belajar?: string | null;
  catatan?: string | null;
  is_available?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Demografi fields
  demografi_province_id?: string | null;
  demografi_regency_id?: string | null;
  keluarga_indonesia?: SiswaKeluargaIndonesia[];
  keluarga_jepang?: SiswaKeluargaJepang[];
  kontak_keluarga?: SiswaKontakKeluarga[];
  pengalaman_kerja?: SiswaPengalamanKerja[];
  pendidikan?: SiswaPendidikan[];
}

// Additional interfaces for family data
export interface SiswaKeluargaIndonesia {
  id: string;
  siswa_id: string;
  nama: string;
  hubungan?: string | null;
  umur?: number | null;
  pekerjaan?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SiswaKeluargaJepang {
  id: string;
  siswa_id: string;
  nama: string;
  hubungan?: string | null;
  umur?: number | null;
  pekerjaan?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SiswaKontakKeluarga {
  id: string;
  siswa_id: string;
  nama: string;
  alamat?: string | null;
  rt_rw?: string | null;
  kelurahan?: string | null;
  kecamatan?: string | null;
  kab_kota?: string | null;
  provinsi?: string | null;
  kode_pos?: string | null;
  no_hp?: string | null;
  penghasilan_per_bulan?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface SiswaPengalamanKerja {
  id: string;
  siswa_id: string;
  nama_perusahaan: string;
  jenis_pekerjaan?: string | null;
  tahun_masuk?: number | null;
  tahun_keluar?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface SiswaPendidikan {
  id: string;
  siswa_id: string;
  jenjang_pendidikan: string;
  nama_institusi: string;
  jurusan?: string | null;
  tahun_masuk?: number | null;
  tahun_lulus?: number | null;
  nilai_akhir?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateSiswaData = Omit<Siswa, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSiswaData = Partial<Siswa> & { id: string };
