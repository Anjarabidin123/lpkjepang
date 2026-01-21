
-- Create table for LPK profile
CREATE TABLE public.profil_lpk (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama text NOT NULL,
  pemilik text,
  alamat text,
  no_telp text,
  email text,
  website text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER update_profil_lpk_updated_at
  BEFORE UPDATE ON public.profil_lpk
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.profil_lpk ENABLE ROW LEVEL SECURITY;

-- Create policies for profil_lpk
CREATE POLICY "Allow authenticated users to view profil_lpk" 
  ON public.profil_lpk 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert profil_lpk" 
  ON public.profil_lpk 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update profil_lpk" 
  ON public.profil_lpk 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete profil_lpk" 
  ON public.profil_lpk 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create index for better performance
CREATE INDEX idx_profil_lpk_active ON public.profil_lpk(is_active);
CREATE INDEX idx_profil_lpk_nama ON public.profil_lpk(nama);

-- Insert default LPK profile (optional)
INSERT INTO public.profil_lpk (nama, pemilik, alamat, no_telp, email) VALUES
('LPK Magang Indonesia', 'Administrator', 'Jakarta, Indonesia', '021-12345678', 'info@lpkmagang.id');
