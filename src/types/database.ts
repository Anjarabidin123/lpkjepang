// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
}

export interface Role {
    id: string;
    name: string;
    display_name: string;
    description: string | null;
    is_system_role: boolean;
    created_at: string;
    updated_at: string;
}

export interface Permission {
    id: string;
    name: string;
    display_name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================
// SISWA TYPES
// ============================================

export interface Siswa {
    id: string;
    nama_lengkap: string;
    nik: string | null;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    jenis_kelamin: string | null;
    agama: string | null;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
    status: string | null;
    created_at: string;
    updated_at: string;
}

export interface SiswaMagang {
    id: string;
    siswa_id: string;
    program_id: string | null;
    perusahaan_id: string | null;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    status: string | null;
    created_at: string;
    updated_at: string;
    siswa?: Siswa;
    program?: Program;
    perusahaan?: Perusahaan;
}

export interface SiswaDocument {
    id: string;
    siswa_id: string;
    document_type: string;
    document_name: string;
    file_path: string | null;
    file_url: string | null;
    uploaded_at: string;
    created_at: string;
    updated_at: string;
}

export interface SiswaKeluargaIndonesia {
    id: string;
    siswa_id: string;
    nama: string;
    hubungan: string | null;
    telepon: string | null;
    alamat: string | null;
    created_at: string;
    updated_at: string;
}

export interface SiswaKeluargaJepang {
    id: string;
    siswa_id: string;
    nama: string;
    hubungan: string | null;
    telepon: string | null;
    alamat: string | null;
    created_at: string;
    updated_at: string;
}

export interface SiswaKontakKeluarga {
    id: string;
    siswa_id: string;
    nama: string;
    hubungan: string | null;
    telepon: string | null;
    alamat: string | null;
    created_at: string;
    updated_at: string;
}

export interface SiswaPengalamanKerja {
    id: string;
    siswa_id: string;
    perusahaan: string;
    posisi: string | null;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    deskripsi: string | null;
    created_at: string;
    updated_at: string;
}

export interface SiswaPendidikan {
    id: string;
    siswa_id: string;
    jenjang: string;
    institusi: string;
    jurusan: string | null;
    tahun_lulus: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================
// JOB ORDER TYPES
// ============================================

export interface JobOrder {
    id: string;
    nomor_jo: string;
    perusahaan_id: string | null;
    kumiai_id: string | null;
    program_id: string | null;
    tanggal_jo: string | null;
    jumlah_peserta: number | null;
    status: string | null;
    created_at: string;
    updated_at: string;
    perusahaan?: Perusahaan;
    kumiai?: Kumiai;
    program?: Program;
}

export interface JobOrderPeserta {
    id: string;
    job_order_id: string;
    siswa_id: string;
    status: string | null;
    created_at: string;
    updated_at: string;
    siswa?: Siswa;
    job_order?: JobOrder;
}

// ============================================
// FINANCIAL TYPES
// ============================================

export interface ArusKas {
    id: string;
    tanggal: string;
    jenis: string;
    kategori: string | null;
    deskripsi: string | null;
    jumlah: number;
    saldo: number | null;
    created_at: string;
    updated_at: string;
}

export interface KategoriPemasukan {
    id: string;
    nama: string;
    kode: string;
    deskripsi: string | null;
    created_at: string;
    updated_at: string;
}

export interface Pemasukan {
    id: string;
    tanggal: string;
    kategori_id: string | null;
    deskripsi: string | null;
    jumlah: number;
    created_at: string;
    updated_at: string;
    kategori?: KategoriPemasukan;
}

export interface KategoriPengeluaran {
    id: string;
    nama: string;
    kode: string;
    deskripsi: string | null;
    created_at: string;
    updated_at: string;
}

export interface Pengeluaran {
    id: string;
    tanggal: string;
    kategori_id: string | null;
    deskripsi: string | null;
    jumlah: number;
    created_at: string;
    updated_at: string;
    kategori?: KategoriPengeluaran;
}

export interface Invoice {
    id: string;
    nomor_invoice: string;
    tanggal: string;
    siswa_id: string | null;
    total: number;
    status: string | null;
    created_at: string;
    updated_at: string;
    siswa?: Siswa;
}

export interface InvoiceItem {
    id: string;
    invoice_id: string;
    deskripsi: string;
    jumlah: number;
    harga: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export interface ItemPembayaran {
    id: string;
    nama: string;
    kode: string;
    deskripsi: string | null;
    harga: number;
    created_at: string;
    updated_at: string;
}

export interface InternalPayment {
    id: string;
    tanggal: string;
    dari: string;
    kepada: string;
    jumlah: number;
    deskripsi: string | null;
    status: string | null;
    created_at: string;
    updated_at: string;
}

export interface KewajibanPembayaran {
    id: string;
    siswa_id: string;
    item_pembayaran_id: string | null;
    jumlah: number;
    tanggal_jatuh_tempo: string | null;
    status: string | null;
    created_at: string;
    updated_at: string;
    siswa?: Siswa;
    item_pembayaran?: ItemPembayaran;
}

// ============================================
// DEMOGRAFI TYPES
// ============================================

export interface DemografiProvince {
    id: string;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface DemografiRegency {
    id: string;
    province_id: string;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
    province?: DemografiProvince;
}

// ============================================
// LPK MITRA TYPES
// ============================================

export interface LpkMitra {
    id: string;
    nama: string;
    kode: string;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
    pic_nama: string | null;
    pic_telepon: string | null;
    created_at: string;
    updated_at: string;
}
