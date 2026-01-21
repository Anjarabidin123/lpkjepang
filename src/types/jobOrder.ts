export interface JobOrder {
  id: string;
  nama_job_order: string;
  kuota?: number | null;
  status?: 'Aktif' | 'Nonaktif' | null;
  catatan?: string | null;
  created_at?: string;
  updated_at?: string;
  jenis_kerja_id?: string | null;
  kumiai_id?: string | null;
  peserta_count?: number; // Add this missing property
  jenis_kerja?: {
    id: string;
    nama: string;
    kode: string;
    kategori?: string | null;
    tingkat_kesulitan?: string | null;
    gaji_minimal?: number | null;
    gaji_maksimal?: number | null;
    syarat_pendidikan?: string | null;
    deskripsi?: string | null;
  };
  kumiai?: {
    id: string;
    nama: string;
    kode: string;
    pic_nama?: string | null;
    pic_telepon?: string | null;
    email?: string | null;
    jumlah_perusahaan?: number | null;
    tanggal_kerjasama?: string | null;
    alamat?: string | null;
  };
}

export interface JobOrderPeserta {
  id: string;
  job_order_id: string;
  siswa_id: string;
  status?: string | null;
  keterangan?: string | null;
  created_at: string;
  updated_at: string;
  siswa?: {
    id: string;
    nama: string;
    nik: string;
    tanggal_lahir: string | null;
    tempat_lahir: string | null;
    jenis_kelamin: string | null;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
    tinggi_badan: number | null;
    berat_badan: number | null;
    ukuran_sepatu: number | null;
    golongan_darah: string | null;
    status_pernikahan: string | null;
    agama: string | null;
    hobi: string | null;
    visi: string | null;
    target_gaji: string | null;
    pengalaman_jepang: string | null;
    skill_bahasa_jepang: string | null;
    foto_url: string | null;
    nama_sekolah: string | null;
    tahun_masuk_sekolah: number | null;
    tahun_lulus_sekolah: number | null;
    jurusan: string | null;
    pengalaman_kerja?: Array<{
      id: string;
      nama_perusahaan: string;
      jenis_pekerjaan: string | null;
      tahun_masuk: number | null;
      tahun_keluar: number | null;
    }>;
    kontak_keluarga?: Array<{
      id: string;
      nama: string;
      alamat: string | null;
      no_hp: string | null;
      penghasilan_per_bulan: number | null;
      rt_rw: string | null;
      kelurahan: string | null;
      kecamatan: string | null;
      kab_kota: string | null;
      provinsi: string | null;
      kode_pos: string | null;
    }>;
    keluarga_indonesia?: Array<{
      id: string;
      nama: string;
      umur: number | null;
      hubungan: string | null;
      pekerjaan: string | null;
    }>;
    keluarga_jepang?: Array<{
      id: string;
      nama: string;
      umur: number | null;
      hubungan: string | null;
      pekerjaan: string | null;
    }>;
    pendidikan?: Array<{
      id: string;
      jenjang_pendidikan: string;
      nama_institusi: string;
      jurusan: string | null;
      tahun_masuk: number | null;
      tahun_lulus: number | null;
      nilai_akhir: string | null;
    }>;
  };
}

// Add the missing type exports
export type JobOrderInsert = Omit<JobOrder, 'id' | 'created_at' | 'updated_at' | 'jenis_kerja' | 'kumiai' | 'peserta_count'>;
export type JobOrderUpdate = Partial<JobOrder>;
export type JobOrderUpdateData = Omit<JobOrderUpdate, 'id'>;

// Keep the existing exports for backward compatibility
export type CreateJobOrderData = JobOrderInsert;
export type UpdateJobOrderData = JobOrderUpdateData;
