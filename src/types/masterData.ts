// ============================================
// MASTER DATA TYPES
// ============================================

export interface JenisKerja {
    id: string;
    nama: string;
    kode: string;
    deskripsi: string | null;
    kategori: string | null;
    tingkat_kesulitan: string | null;
    pendidikan_minimal: string | null;
    gaji_min: number | null;
    gaji_max: number | null;
    total_posisi: number | null;
    created_at: string;
    updated_at: string;
}

export interface PosisiKerja {
    id: string;
    nama: string;
    kode: string;
    deskripsi: string | null;
    perusahaan_id: string | null;
    jenis_kerja_id: string | null;
    created_at: string;
    updated_at: string;
    perusahaan?: Perusahaan | null;
    jenis_kerja?: JenisKerja | null;
}

export interface Kumiai {
    id: string;
    nama: string;
    kode: string;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
    tanggal_kerjasama: string | null;
    pic_nama: string | null;
    pic_telepon: string | null;
    created_at: string;
    updated_at: string;
    perusahaan?: Perusahaan[];
}

export interface Perusahaan {
    id: string;
    nama: string;
    kode: string;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
    kumiai_id: string | null;
    pic_nama: string | null;
    pic_telepon: string | null;
    created_at: string;
    updated_at: string;
    kumiai?: Kumiai | null;
}

export interface Program {
    id: string;
    nama: string;
    kode: string;
    deskripsi: string | null;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    status: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================
// INSERT & UPDATE TYPES
// ============================================

export type JenisKerjaInsert = Omit<JenisKerja, 'id' | 'created_at' | 'updated_at'>;
export type JenisKerjaUpdate = Partial<JenisKerjaInsert>;

export type PosisiKerjaInsert = Omit<PosisiKerja, 'id' | 'created_at' | 'updated_at' | 'perusahaan' | 'jenis_kerja'>;
export type PosisiKerjaUpdate = Partial<PosisiKerjaInsert>;

export type KumiaiInsert = Omit<Kumiai, 'id' | 'created_at' | 'updated_at' | 'perusahaan'>;
export type KumiaiUpdate = Partial<KumiaiInsert>;

export type PerusahaanInsert = Omit<Perusahaan, 'id' | 'created_at' | 'updated_at' | 'kumiai'>;
export type PerusahaanUpdate = Partial<PerusahaanInsert>;

export type ProgramInsert = Omit<Program, 'id' | 'created_at' | 'updated_at'>;
export type ProgramUpdate = Partial<ProgramInsert>;
