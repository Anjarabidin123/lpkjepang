
-- Create a new table for siswa_magang to handle the internship-specific data
CREATE TABLE public.siswa_magang (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id uuid REFERENCES public.siswa(id) ON DELETE CASCADE,
  kumiai_id uuid REFERENCES public.kumiai(id),
  perusahaan_id uuid REFERENCES public.perusahaan(id),
  program_id uuid REFERENCES public.program(id),
  jenis_kerja_id uuid REFERENCES public.jenis_kerja(id),
  posisi_kerja_id uuid REFERENCES public.posisi_kerja(id),
  lokasi text,
  tanggal_mulai_kerja date,
  tanggal_pulang_kerja date,
  gaji decimal(15,2),
  status_magang text DEFAULT 'Aktif',
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER update_siswa_magang_updated_at
  BEFORE UPDATE ON public.siswa_magang
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.siswa_magang ENABLE ROW LEVEL SECURITY;

-- Create policies for siswa_magang (allowing authenticated users to access all data for now)
CREATE POLICY "Allow authenticated users to view siswa_magang" 
  ON public.siswa_magang 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert siswa_magang" 
  ON public.siswa_magang 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update siswa_magang" 
  ON public.siswa_magang 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete siswa_magang" 
  ON public.siswa_magang 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create an index for better performance
CREATE INDEX idx_siswa_magang_siswa_id ON public.siswa_magang(siswa_id);
CREATE INDEX idx_siswa_magang_kumiai_id ON public.siswa_magang(kumiai_id);
CREATE INDEX idx_siswa_magang_perusahaan_id ON public.siswa_magang(perusahaan_id);
