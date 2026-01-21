
-- Add missing columns to siswa_magang table
ALTER TABLE public.siswa_magang 
ADD COLUMN IF NOT EXISTS provinsi_id uuid REFERENCES public.provinsi(id),
ADD COLUMN IF NOT EXISTS kabupaten_id uuid REFERENCES public.kabupaten(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_siswa_magang_provinsi_id ON public.siswa_magang(provinsi_id);
CREATE INDEX IF NOT EXISTS idx_siswa_magang_kabupaten_id ON public.siswa_magang(kabupaten_id);
