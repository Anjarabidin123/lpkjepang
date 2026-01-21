
import type { ExportColumn } from '@/utils/excelUtils';

export const siswaMagangExportColumns: ExportColumn[] = [
  // Siswa Information
  { key: 'siswa.nama', header: 'Nama Siswa', width: 25 },
  { key: 'siswa.nik', header: 'NIK', width: 20 },
  { key: 'siswa.telepon', header: 'Telepon', width: 15 },
  { key: 'siswa.email', header: 'Email', width: 25 },
  
  // Organization Information
  { key: 'kumiai.nama', header: 'Kumiai', width: 20 },
  { key: 'kumiai.kode', header: 'Kode Kumiai', width: 15 },
  { key: 'perusahaan.nama', header: 'Perusahaan', width: 25 },
  { key: 'perusahaan.kode', header: 'Kode Perusahaan', width: 18 },
  
  // Program and Work Information
  { key: 'program.nama', header: 'Program', width: 20 },
  { key: 'program.kode', header: 'Kode Program', width: 15 },
  { key: 'jenis_kerja.nama', header: 'Jenis Kerja', width: 20 },
  { key: 'jenis_kerja.kode', header: 'Kode Jenis Kerja', width: 18 },
  { key: 'posisi_kerja.posisi', header: 'Posisi Kerja', width: 20 },
  { key: 'posisi_kerja.kode', header: 'Kode Posisi Kerja', width: 18 },
  
  // LPK Information
  { key: 'lpk_mitra.nama_lpk', header: 'LPK Mitra', width: 20 },
  { key: 'lpk_mitra.kode', header: 'Kode LPK Mitra', width: 15 },
  
  // Location Information
  { key: 'provinsi.nama', header: 'Provinsi', width: 20 },
  { key: 'provinsi.kode', header: 'Kode Provinsi', width: 15 },
  { key: 'kabupaten.nama', header: 'Kabupaten/Kota', width: 20 },
  { key: 'kabupaten.kode', header: 'Kode Kabupaten', width: 15 },
  { key: 'lokasi', header: 'Lokasi Detail', width: 25 },
  
  // Work Schedule and Compensation
  { key: 'tanggal_mulai_kerja', header: 'Tanggal Mulai', width: 15 },
  { key: 'tanggal_pulang_kerja', header: 'Tanggal Pulang', width: 15 },
  { key: 'gaji', header: 'Gaji', width: 15 },
  
  // Status and Meta
  { key: 'status_magang', header: 'Status Magang', width: 15 },
  { key: 'avatar_url', header: 'URL Avatar', width: 30 },
  { key: 'created_at', header: 'Tanggal Dibuat', width: 18 },
  { key: 'updated_at', header: 'Tanggal Update', width: 18 }
];
