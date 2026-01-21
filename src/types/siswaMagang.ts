
export interface SiswaMagang {
  id: string;
  siswa_id: string | null;
  kumiai_id: string | null;
  perusahaan_id: string | null;
  program_id: string | null;
  jenis_kerja_id: string | null;
  posisi_kerja_id: string | null;
  lpk_mitra_id: string | null;
  demografi_province_id: string | null;
  demografi_regency_id: string | null;
  lokasi: string | null;
  tanggal_mulai_kerja: string | null;
  tanggal_pulang_kerja: string | null;
  gaji: number | null;
  status_magang: string | null;
  avatar_url: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Join fields
  siswa?: {
    id: string;
    nama: string;
    nik: string;
    email: string | null;
    telepon: string | null;
  };
  kumiai?: {
    id: string;
    nama: string;
    kode: string;
  };
  perusahaan?: {
    id: string;
    nama: string;
    kode: string;
  };
  program?: {
    id: string;
    nama: string;
    kode: string;
  };
  jenis_kerja?: {
    id: string;
    nama: string;
    kode: string;
  };
  posisi_kerja?: {
    id: string;
    posisi: string;
    kode: string;
  };
  lpk_mitra?: {
    id: string;
    nama_lpk: string;
    kode: string;
  };
  provinsi?: {
    id: string;
    nama: string;
    kode: string;
  };
  kabupaten?: {
    id: string;
    nama: string;
    kode: string;
  };
}

export type CreateSiswaMagangData = Omit<SiswaMagang, 'id' | 'created_at' | 'updated_at' | 'siswa' | 'kumiai' | 'perusahaan' | 'program' | 'jenis_kerja' | 'posisi_kerja' | 'lpk_mitra' | 'provinsi' | 'kabupaten'>;
export type UpdateSiswaMagangData = Partial<SiswaMagang> & { id: string };
