
-- Create table for siswa education information (informasi pendidikan)
CREATE TABLE public.siswa_pendidikan (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id UUID NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  jenjang_pendidikan TEXT NOT NULL,
  nama_institusi TEXT NOT NULL,
  jurusan TEXT,
  tahun_masuk INTEGER,
  tahun_lulus INTEGER,
  nilai_akhir TEXT,
  sertifikat_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER update_siswa_pendidikan_updated_at
  BEFORE UPDATE ON public.siswa_pendidikan
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Enable RLS
ALTER TABLE public.siswa_pendidikan ENABLE ROW LEVEL SECURITY;

-- Create policies for siswa_pendidikan (allowing authenticated users to access all data for now)
CREATE POLICY "Allow authenticated users to view siswa_pendidikan" 
  ON public.siswa_pendidikan 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert siswa_pendidikan" 
  ON public.siswa_pendidikan 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update siswa_pendidikan" 
  ON public.siswa_pendidikan 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete siswa_pendidikan" 
  ON public.siswa_pendidikan 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create index for better performance
CREATE INDEX idx_siswa_pendidikan_siswa_id ON public.siswa_pendidikan(siswa_id);
