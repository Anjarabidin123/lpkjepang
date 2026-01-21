
-- Add new fields to siswa table
ALTER TABLE public.siswa 
ADD COLUMN foto_url TEXT,
ADD COLUMN nama_sekolah TEXT,
ADD COLUMN tahun_masuk_sekolah INTEGER,
ADD COLUMN tahun_lulus_sekolah INTEGER,
ADD COLUMN jurusan TEXT;

-- Create table for work experience (riwayat pengalaman kerja)
CREATE TABLE public.siswa_pengalaman_kerja (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id UUID NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  nama_perusahaan TEXT NOT NULL,
  tahun_masuk INTEGER,
  tahun_keluar INTEGER,
  jenis_pekerjaan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for emergency contact family (keluarga yang bisa dihubungi)
CREATE TABLE public.siswa_kontak_keluarga (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id UUID NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  alamat TEXT,
  no_hp TEXT,
  penghasilan_per_bulan NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enum for family relationship
CREATE TYPE hubungan_keluarga AS ENUM (
  'Ayah', 'Ibu', 'Suami', 'Istri', 'Anak', 'Kakak', 'Adik', 
  'Kakek', 'Nenek', 'Paman', 'Bibi', 'Sepupu', 'Keponakan', 'Lainnya'
);

-- Create table for family in Indonesia (keluarga di Indonesia)
CREATE TABLE public.siswa_keluarga_indonesia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id UUID NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  umur INTEGER,
  hubungan hubungan_keluarga,
  pekerjaan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for family/relatives in Japan (kerabat/keluarga di Jepang)
CREATE TABLE public.siswa_keluarga_jepang (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id UUID NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  umur INTEGER,
  hubungan hubungan_keluarga,
  pekerjaan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add triggers for updated_at
CREATE TRIGGER update_siswa_pengalaman_kerja_updated_at
  BEFORE UPDATE ON public.siswa_pengalaman_kerja
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_siswa_kontak_keluarga_updated_at
  BEFORE UPDATE ON public.siswa_kontak_keluarga
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_siswa_keluarga_indonesia_updated_at
  BEFORE UPDATE ON public.siswa_keluarga_indonesia
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_siswa_keluarga_jepang_updated_at
  BEFORE UPDATE ON public.siswa_keluarga_jepang
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
