-- Document Templates (Master Dokumen)
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode VARCHAR(50) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  kategori VARCHAR(50) NOT NULL DEFAULT 'lainnya',
  deskripsi TEXT,
  template_content TEXT DEFAULT '',
  is_required BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  urutan INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Variables (Variabel untuk Mail Merge)
CREATE TABLE IF NOT EXISTS public.document_variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  kategori VARCHAR(50) NOT NULL DEFAULT 'siswa',
  source_table VARCHAR(100) NOT NULL,
  source_field VARCHAR(100) NOT NULL,
  format_type VARCHAR(50) DEFAULT 'text',
  default_value TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Siswa Documents (Tracking Dokumen per Siswa)
CREATE TABLE IF NOT EXISTS public.siswa_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_magang_id UUID NOT NULL REFERENCES public.siswa_magang(id) ON DELETE CASCADE,
  document_template_id UUID NOT NULL REFERENCES public.document_templates(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  file_url TEXT,
  generated_content TEXT,
  catatan TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(siswa_magang_id, document_template_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_document_templates_kategori ON public.document_templates(kategori);
CREATE INDEX IF NOT EXISTS idx_document_templates_is_active ON public.document_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_document_variables_kategori ON public.document_variables(kategori);
CREATE INDEX IF NOT EXISTS idx_document_variables_is_active ON public.document_variables(is_active);
CREATE INDEX IF NOT EXISTS idx_siswa_documents_siswa_magang_id ON public.siswa_documents(siswa_magang_id);
CREATE INDEX IF NOT EXISTS idx_siswa_documents_document_template_id ON public.siswa_documents(document_template_id);
CREATE INDEX IF NOT EXISTS idx_siswa_documents_status ON public.siswa_documents(status);

-- RLS Policies
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to document_templates" ON public.document_templates
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to document_variables" ON public.document_variables
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to siswa_documents" ON public.siswa_documents
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default variables
INSERT INTO public.document_variables (nama, display_name, kategori, source_table, source_field, format_type, is_active) VALUES
  ('siswa_nama', 'Nama Lengkap Siswa', 'siswa', 'siswa', 'nama', 'text', true),
  ('siswa_nama_upper', 'Nama Siswa (Kapital)', 'siswa', 'siswa', 'nama', 'uppercase', true),
  ('siswa_nik', 'NIK Siswa', 'siswa', 'siswa', 'nik', 'text', true),
  ('siswa_tempat_lahir', 'Tempat Lahir', 'siswa', 'siswa', 'tempat_lahir', 'text', true),
  ('siswa_tanggal_lahir', 'Tanggal Lahir', 'siswa', 'siswa', 'tanggal_lahir', 'date', true),
  ('siswa_tanggal_lahir_jp', 'Tanggal Lahir (JP)', 'siswa', 'siswa', 'tanggal_lahir', 'date_jp', true),
  ('siswa_alamat', 'Alamat Siswa', 'siswa', 'siswa', 'alamat', 'text', true),
  ('siswa_jenis_kelamin', 'Jenis Kelamin', 'siswa', 'siswa', 'jenis_kelamin', 'text', true),
  ('siswa_no_paspor', 'Nomor Paspor', 'siswa', 'siswa', 'no_paspor', 'text', true),
  ('siswa_email', 'Email Siswa', 'siswa', 'siswa', 'email', 'text', true),
  ('siswa_no_hp', 'No. HP Siswa', 'siswa', 'siswa', 'no_hp', 'phone', true),
  ('perusahaan_nama', 'Nama Perusahaan', 'perusahaan', 'perusahaan', 'nama', 'text', true),
  ('perusahaan_alamat', 'Alamat Perusahaan', 'perusahaan', 'perusahaan', 'alamat', 'text', true),
  ('perusahaan_telepon', 'Telepon Perusahaan', 'perusahaan', 'perusahaan', 'telepon', 'phone', true),
  ('kumiai_nama', 'Nama Kumiai', 'kumiai', 'kumiai', 'nama', 'text', true),
  ('kumiai_alamat', 'Alamat Kumiai', 'kumiai', 'kumiai', 'alamat', 'text', true),
  ('program_nama', 'Nama Program', 'program', 'program', 'nama', 'text', true),
  ('program_durasi', 'Durasi Program', 'program', 'program', 'durasi_bulan', 'number', true),
  ('lpk_nama', 'Nama LPK', 'lpk', 'lpk_profile', 'nama_lpk', 'text', true),
  ('lpk_alamat', 'Alamat LPK', 'lpk', 'lpk_profile', 'alamat', 'text', true),
  ('lpk_direktur', 'Direktur LPK', 'lpk', 'lpk_profile', 'nama_direktur', 'text', true),
  ('tanggal_hari_ini', 'Tanggal Hari Ini', 'sistem', '_system', 'current_date', 'date', true),
  ('tanggal_hari_ini_jp', 'Tanggal Hari Ini (JP)', 'sistem', '_system', 'current_date', 'date_jp', true),
  ('tahun_sekarang', 'Tahun Sekarang', 'sistem', '_system', 'current_year', 'text', true)
ON CONFLICT (nama) DO NOTHING;

-- Insert sample document templates
INSERT INTO public.document_templates (kode, nama, kategori, deskripsi, template_content, is_required, urutan) VALUES
  ('DOC-VISA-001', 'Formulir Aplikasi Visa', 'visa', 'Formulir aplikasi visa kerja ke Jepang', '<h1>FORMULIR APLIKASI VISA</h1><p>Nama Lengkap: {{siswa_nama_upper}}</p><p>NIK: {{siswa_nik}}</p><p>Tempat/Tanggal Lahir: {{siswa_tempat_lahir}}, {{siswa_tanggal_lahir}}</p><p>Alamat: {{siswa_alamat}}</p><p>No. Paspor: {{siswa_no_paspor}}</p><p>Tujuan: {{perusahaan_nama}}</p><p>Tanggal Dibuat: {{tanggal_hari_ini}}</p>', true, 1),
  ('DOC-KONTRAK-001', 'Surat Perjanjian Magang', 'kontrak', 'Surat perjanjian magang antara siswa dan LPK', '<h1>SURAT PERJANJIAN MAGANG</h1><p>Yang bertanda tangan di bawah ini:</p><p>Nama: {{siswa_nama}}</p><p>NIK: {{siswa_nik}}</p><p>Alamat: {{siswa_alamat}}</p><p>Selanjutnya disebut PIHAK PERTAMA</p><p>Dan</p><p>Nama LPK: {{lpk_nama}}</p><p>Alamat: {{lpk_alamat}}</p><p>Direktur: {{lpk_direktur}}</p><p>Selanjutnya disebut PIHAK KEDUA</p><p>Tanggal: {{tanggal_hari_ini}}</p>', true, 2),
  ('DOC-ADMIN-001', 'Data Diri Lengkap', 'administrasi', 'Formulir data diri lengkap siswa', '<h1>DATA DIRI LENGKAP</h1><p>Nama: {{siswa_nama}}</p><p>NIK: {{siswa_nik}}</p><p>Tempat Lahir: {{siswa_tempat_lahir}}</p><p>Tanggal Lahir: {{siswa_tanggal_lahir}}</p><p>生年月日: {{siswa_tanggal_lahir_jp}}</p><p>Jenis Kelamin: {{siswa_jenis_kelamin}}</p><p>Alamat: {{siswa_alamat}}</p><p>Email: {{siswa_email}}</p><p>No. HP: {{siswa_no_hp}}</p>', true, 3),
  ('DOC-KESEHATAN-001', 'Surat Keterangan Sehat', 'kesehatan', 'Template surat keterangan sehat dari dokter', '<h1>SURAT KETERANGAN SEHAT</h1><p>Yang bertanda tangan di bawah ini menerangkan bahwa:</p><p>Nama: {{siswa_nama}}</p><p>NIK: {{siswa_nik}}</p><p>Tempat/Tanggal Lahir: {{siswa_tempat_lahir}}, {{siswa_tanggal_lahir}}</p><p>Dinyatakan dalam keadaan sehat jasmani dan rohani.</p><p>Tanggal: {{tanggal_hari_ini}}</p>', true, 4)
ON CONFLICT (kode) DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_document_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_document_templates_updated_at ON public.document_templates;
CREATE TRIGGER trigger_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW EXECUTE FUNCTION update_document_updated_at();

DROP TRIGGER IF EXISTS trigger_siswa_documents_updated_at ON public.siswa_documents;
CREATE TRIGGER trigger_siswa_documents_updated_at
  BEFORE UPDATE ON public.siswa_documents
  FOR EACH ROW EXECUTE FUNCTION update_document_updated_at();
