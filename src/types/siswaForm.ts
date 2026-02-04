
// Shared form data type for Siswa form components
export interface SiswaFormData {
  nama: string;
  nik: string;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  tanggal_lahir?: string;
  tempat_lahir?: string;
  demografi_province_id?: string;
  demografi_regency_id?: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  umur?: number;
  tinggi_badan?: number;
  berat_badan?: number;
  ukuran_sepatu?: number;
  ukuran_kepala?: number;
  ukuran_pinggang?: number;
  golongan_darah?: string;
  mata_kanan?: string;
  mata_kiri?: string;
  buta_warna?: boolean;
  warna_buta?: string;
  penggunaan_tangan?: string;
  merokok_sekarang?: string;
  merokok_jepang?: string;
  minum_sake?: string;
  agama?: string;
  status_pernikahan?: string;
  hobi?: string;
  minat?: string;
  visi?: string;
  bakat_khusus?: string;
  kelebihan?: string;
  kekurangan?: string;
  pengalaman?: string;
  target_gaji?: string;
  target_menabung?: string;
  tujuan_jepang?: string;
  pengalaman_jepang?: string;
  skill_bahasa_jepang?: string;
  tanggal_masuk_lpk?: string;
  lama_belajar?: string;
  catatan?: string;
  status?: string;
  program_id?: string;
  posisi_kerja_id?: string;
  lpk_mitra_id?: string;
  foto_siswa?: string;
  foto_url?: string;
  nama_sekolah?: string;
  tahun_masuk_sekolah?: number;
  tahun_lulus_sekolah?: number;
  jurusan?: string;
  is_available?: boolean;
  keluarga_indonesia?: any[];
  keluarga_jepang?: any[];
  kontak_keluarga?: any[];
  pengalaman_kerja?: any[];
  kontak_darurat_nama?: string;
  kontak_darurat_no_hp?: string;
  kontak_darurat_alamat?: string;
  kontak_darurat_rt_rw?: string;
  kontak_darurat_kelurahan?: string;
  kontak_darurat_kecamatan?: string;
  kontak_darurat_kab_kota?: string;
  kontak_darurat_provinsi?: string;
  kontak_darurat_kode_pos?: string;
  kontak_darurat_penghasilan_per_bulan?: string | number;
  pendidikan?: any[];
}



