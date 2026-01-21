export interface DocumentTemplate {
  id: string;
  kode: string;
  nama: string;
  kategori: DocumentCategory;
  deskripsi?: string;
  template_content: string;
  is_required: boolean;
  is_active: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentVariable {
  id: string;
  nama: string;
  display_name: string;
  kategori: VariableCategory;
  source_table: string;
  source_field: string;
  format_type: VariableFormatType;
  default_value?: string;
  is_active: boolean;
  created_at: string;
}

export interface SiswaDocument {
  id: string;
  siswa_magang_id: string;
  document_template_id: string;
  status: DocumentStatus;
  file_url?: string;
  generated_content?: string;
  catatan?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  document_template?: DocumentTemplate;
  siswa_magang?: {
    id: string;
    siswa?: {
      id: string;
      nama: string;
      nik?: string;
      foto_url?: string;
    };
  };
}

export type DocumentCategory = 
  | 'visa'
  | 'kontrak'
  | 'administrasi'
  | 'kesehatan'
  | 'pendidikan'
  | 'keuangan'
  | 'lainnya';

export type VariableCategory =
  | 'siswa'
  | 'perusahaan'
  | 'kumiai'
  | 'program'
  | 'lpk'
  | 'job_order'
  | 'sistem';

export type VariableFormatType =
  | 'text'
  | 'date'
  | 'date_jp'
  | 'currency'
  | 'currency_jp'
  | 'uppercase'
  | 'lowercase'
  | 'number'
  | 'phone';

export type DocumentStatus =
  | 'pending'
  | 'draft'
  | 'uploaded'
  | 'review'
  | 'verified'
  | 'rejected'
  | 'expired';

export interface CreateDocumentTemplateData {
  kode: string;
  nama: string;
  kategori: DocumentCategory;
  deskripsi?: string;
  template_content: string;
  is_required?: boolean;
  is_active?: boolean;
  urutan?: number;
}

export interface UpdateDocumentTemplateData extends Partial<CreateDocumentTemplateData> {}

export interface CreateDocumentVariableData {
  nama: string;
  display_name: string;
  kategori: VariableCategory;
  source_table: string;
  source_field: string;
  format_type?: VariableFormatType;
  default_value?: string;
  is_active?: boolean;
}

export interface UpdateDocumentVariableData extends Partial<CreateDocumentVariableData> {}

export interface CreateSiswaDocumentData {
  siswa_magang_id: string;
  document_template_id: string;
  status?: DocumentStatus;
  file_url?: string;
  generated_content?: string;
  catatan?: string;
}

export interface UpdateSiswaDocumentData extends Partial<Omit<CreateSiswaDocumentData, 'siswa_magang_id' | 'document_template_id'>> {
  verified_by?: string;
  verified_at?: string;
}

export interface DocumentStats {
  total_templates: number;
  active_templates: number;
  total_variables: number;
  total_siswa_documents: number;
  pending_documents: number;
  verified_documents: number;
}

export interface SiswaDocumentSummary {
  siswa_magang_id: string;
  siswa_name: string;
  siswa_foto?: string;
  total_required: number;
  completed: number;
  pending: number;
  rejected: number;
  completion_percentage: number;
}

export const DOCUMENT_CATEGORIES: { value: DocumentCategory; label: string; icon: string }[] = [
  { value: 'visa', label: 'Visa & Imigrasi', icon: '🛂' },
  { value: 'kontrak', label: 'Kontrak & Perjanjian', icon: '📝' },
  { value: 'administrasi', label: 'Administrasi', icon: '📋' },
  { value: 'kesehatan', label: 'Kesehatan', icon: '🏥' },
  { value: 'pendidikan', label: 'Pendidikan', icon: '🎓' },
  { value: 'keuangan', label: 'Keuangan', icon: '💰' },
  { value: 'lainnya', label: 'Lainnya', icon: '📁' },
];

export const VARIABLE_CATEGORIES: { value: VariableCategory; label: string }[] = [
  { value: 'siswa', label: 'Data Siswa' },
  { value: 'perusahaan', label: 'Data Perusahaan' },
  { value: 'kumiai', label: 'Data Kumiai' },
  { value: 'program', label: 'Data Program' },
  { value: 'lpk', label: 'Data LPK' },
  { value: 'job_order', label: 'Data Job Order' },
  { value: 'sistem', label: 'Data Sistem' },
];

export const VARIABLE_FORMATS: { value: VariableFormatType; label: string; example: string }[] = [
  { value: 'text', label: 'Teks Biasa', example: 'John Doe' },
  { value: 'date', label: 'Tanggal (ID)', example: '15 Januari 2024' },
  { value: 'date_jp', label: 'Tanggal (JP)', example: '2024年1月15日' },
  { value: 'currency', label: 'Mata Uang (IDR)', example: 'Rp 1.500.000' },
  { value: 'currency_jp', label: 'Mata Uang (JPY)', example: '¥150,000' },
  { value: 'uppercase', label: 'Huruf Besar', example: 'JOHN DOE' },
  { value: 'lowercase', label: 'Huruf Kecil', example: 'john doe' },
  { value: 'number', label: 'Angka', example: '1,234' },
  { value: 'phone', label: 'Telepon', example: '+62 812-3456-7890' },
];

export const DOCUMENT_STATUSES: { value: DocumentStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Menunggu', color: 'bg-gray-100 text-gray-700' },
  { value: 'draft', label: 'Draft', color: 'bg-blue-100 text-blue-700' },
  { value: 'uploaded', label: 'Terunggah', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'review', label: 'Dalam Review', color: 'bg-amber-100 text-amber-700' },
  { value: 'verified', label: 'Terverifikasi', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'rejected', label: 'Ditolak', color: 'bg-red-100 text-red-700' },
  { value: 'expired', label: 'Kedaluwarsa', color: 'bg-rose-100 text-rose-700' },
];

export const DEFAULT_VARIABLES: Omit<DocumentVariable, 'id' | 'created_at'>[] = [
  // Siswa variables
  { nama: 'siswa_nama', display_name: 'Nama Lengkap Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'nama', format_type: 'text', is_active: true },
  { nama: 'siswa_nama_upper', display_name: 'Nama Siswa (Kapital)', kategori: 'siswa', source_table: 'siswa', source_field: 'nama', format_type: 'uppercase', is_active: true },
  { nama: 'siswa_nik', display_name: 'NIK Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'nik', format_type: 'text', is_active: true },
  { nama: 'siswa_tempat_lahir', display_name: 'Tempat Lahir', kategori: 'siswa', source_table: 'siswa', source_field: 'tempat_lahir', format_type: 'text', is_active: true },
  { nama: 'siswa_tanggal_lahir', display_name: 'Tanggal Lahir', kategori: 'siswa', source_table: 'siswa', source_field: 'tanggal_lahir', format_type: 'date', is_active: true },
  { nama: 'siswa_tanggal_lahir_jp', display_name: 'Tanggal Lahir (JP)', kategori: 'siswa', source_table: 'siswa', source_field: 'tanggal_lahir', format_type: 'date_jp', is_active: true },
  { nama: 'siswa_alamat', display_name: 'Alamat Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'alamat', format_type: 'text', is_active: true },
  { nama: 'siswa_jenis_kelamin', display_name: 'Jenis Kelamin', kategori: 'siswa', source_table: 'siswa', source_field: 'jenis_kelamin', format_type: 'text', is_active: true },
  { nama: 'siswa_no_paspor', display_name: 'Nomor Paspor', kategori: 'siswa', source_table: 'siswa', source_field: 'no_paspor', format_type: 'text', is_active: true },
  { nama: 'siswa_email', display_name: 'Email Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'email', format_type: 'text', is_active: true },
  { nama: 'siswa_no_hp', display_name: 'No. HP Siswa', kategori: 'siswa', source_table: 'siswa', source_field: 'no_hp', format_type: 'phone', is_active: true },
  
  // Perusahaan variables
  { nama: 'perusahaan_nama', display_name: 'Nama Perusahaan', kategori: 'perusahaan', source_table: 'perusahaan', source_field: 'nama', format_type: 'text', is_active: true },
  { nama: 'perusahaan_alamat', display_name: 'Alamat Perusahaan', kategori: 'perusahaan', source_table: 'perusahaan', source_field: 'alamat', format_type: 'text', is_active: true },
  { nama: 'perusahaan_telepon', display_name: 'Telepon Perusahaan', kategori: 'perusahaan', source_table: 'perusahaan', source_field: 'telepon', format_type: 'phone', is_active: true },
  
  // Kumiai variables
  { nama: 'kumiai_nama', display_name: 'Nama Kumiai', kategori: 'kumiai', source_table: 'kumiai', source_field: 'nama', format_type: 'text', is_active: true },
  { nama: 'kumiai_alamat', display_name: 'Alamat Kumiai', kategori: 'kumiai', source_table: 'kumiai', source_field: 'alamat', format_type: 'text', is_active: true },
  
  // Program variables
  { nama: 'program_nama', display_name: 'Nama Program', kategori: 'program', source_table: 'program', source_field: 'nama', format_type: 'text', is_active: true },
  { nama: 'program_durasi', display_name: 'Durasi Program', kategori: 'program', source_table: 'program', source_field: 'durasi_bulan', format_type: 'number', is_active: true },
  
  // LPK variables
  { nama: 'lpk_nama', display_name: 'Nama LPK', kategori: 'lpk', source_table: 'lpk_profile', source_field: 'nama_lpk', format_type: 'text', is_active: true },
  { nama: 'lpk_alamat', display_name: 'Alamat LPK', kategori: 'lpk', source_table: 'lpk_profile', source_field: 'alamat', format_type: 'text', is_active: true },
  { nama: 'lpk_direktur', display_name: 'Direktur LPK', kategori: 'lpk', source_table: 'lpk_profile', source_field: 'nama_direktur', format_type: 'text', is_active: true },
  
  // System variables
  { nama: 'tanggal_hari_ini', display_name: 'Tanggal Hari Ini', kategori: 'sistem', source_table: '_system', source_field: 'current_date', format_type: 'date', is_active: true },
  { nama: 'tanggal_hari_ini_jp', display_name: 'Tanggal Hari Ini (JP)', kategori: 'sistem', source_table: '_system', source_field: 'current_date', format_type: 'date_jp', is_active: true },
  { nama: 'tahun_sekarang', display_name: 'Tahun Sekarang', kategori: 'sistem', source_table: '_system', source_field: 'current_year', format_type: 'text', is_active: true },
];
