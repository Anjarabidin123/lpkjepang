
import type { ExportColumn } from '@/utils/excelUtils';

export const siswaExportColumns: ExportColumn[] = [
  // Basic Information
  { key: 'nik', header: 'NIK', width: 20 },
  { key: 'nama', header: 'Nama Lengkap', width: 25 },
  { key: 'jenis_kelamin', header: 'Jenis Kelamin', width: 15 },
  { key: 'tempat_lahir', header: 'Tempat Lahir', width: 20 },
  { key: 'tanggal_lahir', header: 'Tanggal Lahir', width: 15 },
  { key: 'umur', header: 'Umur', width: 10 },
  { key: 'alamat', header: 'Alamat', width: 30 },
  { key: 'telepon', header: 'Telepon', width: 15 },
  { key: 'email', header: 'Email', width: 25 },
  
  // Physical Information
  { key: 'tinggi_badan', header: 'Tinggi Badan (cm)', width: 15 },
  { key: 'berat_badan', header: 'Berat Badan (kg)', width: 15 },
  { key: 'ukuran_sepatu', header: 'Ukuran Sepatu', width: 15 },
  { key: 'ukuran_kepala', header: 'Ukuran Kepala (cm)', width: 18 },
  { key: 'ukuran_pinggang', header: 'Ukuran Pinggang (cm)', width: 18 },
  { key: 'golongan_darah', header: 'Golongan Darah', width: 15 },
  
  // Health Information
  { key: 'mata_kanan', header: 'Mata Kanan', width: 15 },
  { key: 'mata_kiri', header: 'Mata Kiri', width: 15 },
  { key: 'buta_warna', header: 'Buta Warna', width: 12 },
  { key: 'warna_buta', header: 'Jenis Buta Warna', width: 18 },
  { key: 'penggunaan_tangan', header: 'Penggunaan Tangan', width: 18 },
  { key: 'merokok_sekarang', header: 'Status Merokok', width: 15 },
  { key: 'merokok_jepang', header: 'Merokok di Jepang', width: 18 },
  { key: 'minum_sake', header: 'Minum Sake', width: 15 },
  
  // Personal Information
  { key: 'agama', header: 'Agama', width: 15 },
  { key: 'status_pernikahan', header: 'Status Pernikahan', width: 18 },
  { key: 'hobi', header: 'Hobi', width: 20 },
  { key: 'minat', header: 'Minat', width: 20 },
  { key: 'visi', header: 'Visi', width: 25 },
  { key: 'bakat_khusus', header: 'Bakat Khusus', width: 20 },
  { key: 'kelebihan', header: 'Kelebihan', width: 20 },
  { key: 'kekurangan', header: 'Kekurangan', width: 20 },
  { key: 'pengalaman', header: 'Pengalaman', width: 25 },
  
  // Education Information
  { key: 'nama_sekolah', header: 'Nama Sekolah', width: 25 },
  { key: 'jurusan', header: 'Jurusan', width: 20 },
  { key: 'tahun_masuk_sekolah', header: 'Tahun Masuk Sekolah', width: 18 },
  { key: 'tahun_lulus_sekolah', header: 'Tahun Lulus Sekolah', width: 18 },
  
  // Japan Information
  { key: 'skill_bahasa_jepang', header: 'Skill Bahasa Jepang', width: 20 },
  { key: 'pengalaman_jepang', header: 'Pengalaman Jepang', width: 25 },
  { key: 'target_gaji', header: 'Target Gaji', width: 15 },
  { key: 'target_menabung', header: 'Target Menabung', width: 18 },
  { key: 'tujuan_jepang', header: 'Tujuan ke Jepang', width: 25 },
  
  // LPK Information
  { key: 'tanggal_masuk_lpk', header: 'Tanggal Masuk LPK', width: 18 },
  { key: 'lama_belajar', header: 'Lama Belajar', width: 15 },
  
  // Status and Meta
  { key: 'status', header: 'Status', width: 15 },
  { key: 'is_available', header: 'Ketersediaan', width: 15 },
  { key: 'tanggal_daftar', header: 'Tanggal Daftar', width: 15 },
  { key: 'catatan', header: 'Catatan', width: 30 },
  
  // Photo URLs
  { key: 'foto_siswa', header: 'URL Foto Siswa', width: 30 },
  { key: 'foto_url', header: 'URL Foto Alternatif', width: 30 }
];
