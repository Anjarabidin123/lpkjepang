
-- Create enum types for various status fields
CREATE TYPE public.status_siswa AS ENUM ('Aktif', 'Diterima', 'Proses', 'Ditolak');
CREATE TYPE public.status_umum AS ENUM ('Aktif', 'Nonaktif');
CREATE TYPE public.status_posisi AS ENUM ('Buka', 'Penuh', 'Tutup');
CREATE TYPE public.jenis_kelamin AS ENUM ('Laki-laki', 'Perempuan');
CREATE TYPE public.tingkat_kesulitan AS ENUM ('Rendah', 'Menengah', 'Tinggi');

-- Create Kumiai table
CREATE TABLE public.kumiai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    kode TEXT UNIQUE NOT NULL,
    alamat TEXT,
    telepon TEXT,
    email TEXT,
    pic_nama TEXT,
    pic_telepon TEXT,
    status status_umum DEFAULT 'Aktif',
    jumlah_perusahaan INTEGER DEFAULT 0,
    tanggal_kerjasama DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Perusahaan table
CREATE TABLE public.perusahaan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    kode TEXT UNIQUE NOT NULL,
    alamat TEXT,
    telepon TEXT,
    email TEXT,
    kumiai_id UUID REFERENCES public.kumiai(id),
    bidang_usaha TEXT,
    kapasitas INTEGER DEFAULT 0,
    status status_umum DEFAULT 'Aktif',
    tanggal_kerjasama DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Program table
CREATE TABLE public.program (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    kode TEXT UNIQUE NOT NULL,
    deskripsi TEXT,
    durasi INTEGER,
    satuan_durasi TEXT DEFAULT 'bulan',
    biaya BIGINT,
    kuota INTEGER,
    peserta_terdaftar INTEGER DEFAULT 0,
    status status_umum DEFAULT 'Aktif',
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Jenis Kerja table
CREATE TABLE public.jenis_kerja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    kode TEXT UNIQUE NOT NULL,
    deskripsi TEXT,
    kategori TEXT,
    tingkat_kesulitan tingkat_kesulitan DEFAULT 'Menengah',
    syarat_pendidikan TEXT,
    gaji_minimal INTEGER,
    gaji_maksimal INTEGER,
    status status_umum DEFAULT 'Aktif',
    total_posisi INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Posisi Kerja table
CREATE TABLE public.posisi_kerja (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    perusahaan_id UUID REFERENCES public.perusahaan(id),
    jenis_kerja_id UUID REFERENCES public.jenis_kerja(id),
    posisi TEXT NOT NULL,
    lokasi TEXT,
    kuota INTEGER,
    terisi INTEGER DEFAULT 0,
    gaji_harian INTEGER,
    jam_kerja TEXT,
    persyaratan TEXT,
    status status_posisi DEFAULT 'Buka',
    tanggal_buka DATE,
    tanggal_tutup DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Siswa table
CREATE TABLE public.siswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    nik TEXT UNIQUE NOT NULL,
    tanggal_lahir DATE,
    jenis_kelamin jenis_kelamin,
    alamat TEXT,
    telepon TEXT,
    email TEXT UNIQUE,
    status status_siswa DEFAULT 'Proses',
    program_id UUID REFERENCES public.program(id),
    posisi_kerja_id UUID REFERENCES public.posisi_kerja(id),
    tanggal_daftar DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.kumiai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perusahaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jenis_kerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posisi_kerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin users
-- Kumiai policies
CREATE POLICY "Admins can manage kumiai" ON public.kumiai FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderators can view kumiai" ON public.kumiai FOR SELECT USING (public.has_role(auth.uid(), 'moderator'));

-- Perusahaan policies
CREATE POLICY "Admins can manage perusahaan" ON public.perusahaan FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderators can view perusahaan" ON public.perusahaan FOR SELECT USING (public.has_role(auth.uid(), 'moderator'));

-- Program policies
CREATE POLICY "Admins can manage program" ON public.program FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderators can view program" ON public.program FOR SELECT USING (public.has_role(auth.uid(), 'moderator'));

-- Jenis Kerja policies
CREATE POLICY "Admins can manage jenis_kerja" ON public.jenis_kerja FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderators can view jenis_kerja" ON public.jenis_kerja FOR SELECT USING (public.has_role(auth.uid(), 'moderator'));

-- Posisi Kerja policies
CREATE POLICY "Admins can manage posisi_kerja" ON public.posisi_kerja FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderators can view posisi_kerja" ON public.posisi_kerja FOR SELECT USING (public.has_role(auth.uid(), 'moderator'));

-- Siswa policies
CREATE POLICY "Admins can manage siswa" ON public.siswa FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderators can view siswa" ON public.siswa FOR SELECT USING (public.has_role(auth.uid(), 'moderator'));

-- Insert sample data
-- Insert Kumiai data
INSERT INTO public.kumiai (nama, kode, alamat, telepon, email, pic_nama, pic_telepon, status, jumlah_perusahaan, tanggal_kerjasama) VALUES
('Tokyo Manufacturing Association', 'TMA001', 'Tokyo, Japan', '+81-3-1234-5678', 'info@tma.jp', 'Tanaka-san', '+81-90-1234-5678', 'Aktif', 15, '2023-01-15'),
('Osaka Industrial Cooperative', 'OIC002', 'Osaka, Japan', '+81-6-8765-4321', 'contact@oic.jp', 'Yamamoto-san', '+81-90-8765-4321', 'Aktif', 8, '2023-03-20'),
('Nagoya Tech Alliance', 'NTA003', 'Nagoya, Japan', '+81-52-9876-5432', 'admin@nta.jp', 'Suzuki-san', '+81-90-9876-5432', 'Nonaktif', 5, '2022-11-10');

-- Insert Perusahaan data
INSERT INTO public.perusahaan (nama, kode, alamat, telepon, email, kumiai_id, bidang_usaha, kapasitas, status, tanggal_kerjasama) VALUES
('Toyota Motor Corporation', 'TMC001', 'Toyota City, Aichi, Japan', '+81-565-28-2121', 'hr@toyota.co.jp', (SELECT id FROM public.kumiai WHERE kode = 'TMA001'), 'Otomotif', 50, 'Aktif', '2023-02-01'),
('Honda Motor Co Ltd', 'HMC002', 'Minato, Tokyo, Japan', '+81-3-3423-1111', 'contact@honda.co.jp', (SELECT id FROM public.kumiai WHERE kode = 'TMA001'), 'Otomotif', 30, 'Aktif', '2023-02-15'),
('Panasonic Corporation', 'PNC003', 'Kadoma, Osaka, Japan', '+81-6-6908-1121', 'info@panasonic.co.jp', (SELECT id FROM public.kumiai WHERE kode = 'OIC002'), 'Elektronik', 25, 'Aktif', '2023-03-01');

-- Insert Program data
INSERT INTO public.program (nama, kode, deskripsi, durasi, satuan_durasi, biaya, kuota, peserta_terdaftar, status, tanggal_mulai, tanggal_selesai) VALUES
('Teknik Mesin', 'TM001', 'Program pelatihan teknik mesin untuk industri manufaktur', 12, 'bulan', 25000000, 30, 28, 'Aktif', '2024-01-01', '2024-12-31'),
('Elektronik Industri', 'EI002', 'Program pelatihan elektronik untuk industri teknologi', 10, 'bulan', 23000000, 25, 22, 'Aktif', '2024-02-01', '2024-11-30'),
('Otomotif', 'OT003', 'Program pelatihan otomotif untuk industri kendaraan', 14, 'bulan', 27000000, 20, 18, 'Aktif', '2024-03-01', '2025-04-30');

-- Insert Jenis Kerja data
INSERT INTO public.jenis_kerja (nama, kode, deskripsi, kategori, tingkat_kesulitan, syarat_pendidikan, gaji_minimal, gaji_maksimal, status, total_posisi) VALUES
('Operator Mesin', 'OM001', 'Mengoperasikan mesin produksi manufaktur', 'Produksi', 'Menengah', 'SMA/SMK', 180000, 220000, 'Aktif', 45),
('Quality Control', 'QC002', 'Mengontrol kualitas produk manufaktur', 'Quality Assurance', 'Tinggi', 'D3/S1', 200000, 280000, 'Aktif', 25),
('Assembly Line', 'AL003', 'Perakitan komponen di jalur produksi', 'Produksi', 'Rendah', 'SMA/SMK', 160000, 200000, 'Aktif', 65);

-- Insert Posisi Kerja data
INSERT INTO public.posisi_kerja (kode, perusahaan_id, jenis_kerja_id, posisi, lokasi, kuota, terisi, gaji_harian, jam_kerja, persyaratan, status, tanggal_buka, tanggal_tutup) VALUES
('POS001', (SELECT id FROM public.perusahaan WHERE kode = 'TMC001'), (SELECT id FROM public.jenis_kerja WHERE kode = 'OM001'), 'Machine Operator - Line A', 'Toyota City, Aichi', 10, 8, 180000, '8 jam/hari', 'SMA/SMK, Pengalaman 1 tahun', 'Buka', '2024-01-15', '2024-02-15'),
('POS002', (SELECT id FROM public.perusahaan WHERE kode = 'HMC002'), (SELECT id FROM public.jenis_kerja WHERE kode = 'QC002'), 'QC Inspector - Final Assembly', 'Minato, Tokyo', 5, 5, 220000, '8 jam/hari', 'D3/S1 Teknik, Pengalaman QC 2 tahun', 'Penuh', '2024-01-10', '2024-02-10'),
('POS003', (SELECT id FROM public.perusahaan WHERE kode = 'PNC003'), (SELECT id FROM public.jenis_kerja WHERE kode = 'AL003'), 'Electronics Assembly Worker', 'Kadoma, Osaka', 15, 12, 170000, '8 jam/hari', 'SMA/SMK, Tidak perlu pengalaman', 'Buka', '2024-02-01', '2024-03-01');

-- Insert Siswa data
INSERT INTO public.siswa (nama, nik, tanggal_lahir, jenis_kelamin, alamat, telepon, email, status, program_id, tanggal_daftar) VALUES
('Ahmad Fadli', '3201123456789012', '1998-05-15', 'Laki-laki', 'Jakarta', '081234567890', 'ahmad.fadli@email.com', 'Aktif', (SELECT id FROM public.program WHERE kode = 'TM001'), '2024-01-15'),
('Sari Dewi', '3201123456789013', '1999-03-22', 'Perempuan', 'Bandung', '081234567891', 'sari.dewi@email.com', 'Diterima', (SELECT id FROM public.program WHERE kode = 'EI002'), '2024-01-10'),
('Budi Santoso', '3201123456789014', '1997-08-10', 'Laki-laki', 'Surabaya', '081234567892', 'budi.santoso@email.com', 'Proses', (SELECT id FROM public.program WHERE kode = 'OT003'), '2024-01-20');

-- Create triggers to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kumiai_updated_at BEFORE UPDATE ON public.kumiai FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_perusahaan_updated_at BEFORE UPDATE ON public.perusahaan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_program_updated_at BEFORE UPDATE ON public.program FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jenis_kerja_updated_at BEFORE UPDATE ON public.jenis_kerja FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posisi_kerja_updated_at BEFORE UPDATE ON public.posisi_kerja FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_siswa_updated_at BEFORE UPDATE ON public.siswa FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
