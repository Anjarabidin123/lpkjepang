
-- Create demografi tables with proper structure
CREATE TABLE public.demografi_countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kode TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  nama_lokal TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.demografi_provinces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL REFERENCES public.demografi_countries(id) ON DELETE CASCADE,
  kode TEXT NOT NULL,
  nama TEXT NOT NULL,
  nama_lokal TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(country_id, kode)
);

CREATE TABLE public.demografi_regencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  province_id UUID NOT NULL REFERENCES public.demografi_provinces(id) ON DELETE CASCADE,
  kode TEXT NOT NULL,
  nama TEXT NOT NULL,
  nama_lokal TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(province_id, kode)
);

-- Insert countries
INSERT INTO public.demografi_countries (kode, nama, nama_lokal) VALUES
('ID', 'Indonesia', 'Indonesia'),
('JP', 'Jepang', '日本');

-- Insert sample provinces
INSERT INTO public.demografi_provinces (country_id, kode, nama, nama_lokal) VALUES
((SELECT id FROM public.demografi_countries WHERE kode = 'ID'), 'JB', 'Jawa Barat', 'Jawa Barat'),
((SELECT id FROM public.demografi_countries WHERE kode = 'ID'), 'JT', 'Jawa Tengah', 'Jawa Tengah'),
((SELECT id FROM public.demografi_countries WHERE kode = 'ID'), 'JI', 'Jawa Timur', 'Jawa Timur'),
((SELECT id FROM public.demografi_countries WHERE kode = 'JP'), 'TK', 'Tokyo', '東京都'),
((SELECT id FROM public.demografi_countries WHERE kode = 'JP'), 'OS', 'Osaka', '大阪府');

-- Insert sample regencies for Jawa Tengah
INSERT INTO public.demografi_regencies (province_id, kode, nama, nama_lokal) VALUES
((SELECT id FROM public.demografi_provinces WHERE kode = 'JT'), 'CLP', 'Cilacap', 'Cilacap'),
((SELECT id FROM public.demografi_provinces WHERE kode = 'JT'), 'KBM', 'Kebumen', 'Kebumen'),
((SELECT id FROM public.demografi_provinces WHERE kode = 'JT'), 'MAG', 'Magelang', 'Magelang'),
((SELECT id FROM public.demografi_provinces WHERE kode = 'JT'), 'KLT', 'Klaten', 'Klaten'),
((SELECT id FROM public.demografi_provinces WHERE kode = 'JT'), 'BOY', 'Boyolali', 'Boyolali');

-- Add demografi fields to siswa table
ALTER TABLE public.siswa 
ADD COLUMN IF NOT EXISTS demografi_province_id UUID REFERENCES public.demografi_provinces(id),
ADD COLUMN IF NOT EXISTS demografi_regency_id UUID REFERENCES public.demografi_regencies(id);

-- Add demografi fields to siswa_magang table
ALTER TABLE public.siswa_magang 
ADD COLUMN IF NOT EXISTS demografi_province_id UUID REFERENCES public.demografi_provinces(id),
ADD COLUMN IF NOT EXISTS demografi_regency_id UUID REFERENCES public.demografi_regencies(id);

-- Add indexes for performance
CREATE INDEX idx_demografi_provinces_country ON public.demografi_provinces(country_id);
CREATE INDEX idx_demografi_provinces_active ON public.demografi_provinces(is_active);
CREATE INDEX idx_demografi_regencies_province ON public.demografi_regencies(province_id);
CREATE INDEX idx_demografi_regencies_active ON public.demografi_regencies(is_active);
CREATE INDEX idx_siswa_demografi_province ON public.siswa(demografi_province_id);
CREATE INDEX idx_siswa_demografi_regency ON public.siswa(demografi_regency_id);
CREATE INDEX idx_siswa_magang_demografi_province ON public.siswa_magang(demografi_province_id);
CREATE INDEX idx_siswa_magang_demografi_regency ON public.siswa_magang(demografi_regency_id);

-- Enable RLS
ALTER TABLE public.demografi_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demografi_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demografi_regencies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to view countries" ON public.demografi_countries FOR SELECT USING (true);
CREATE POLICY "Admins can manage countries" ON public.demografi_countries FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow authenticated users to view provinces" ON public.demografi_provinces FOR SELECT USING (true);
CREATE POLICY "Admins can manage provinces" ON public.demografi_provinces FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow authenticated users to view regencies" ON public.demografi_regencies FOR SELECT USING (true);
CREATE POLICY "Admins can manage regencies" ON public.demografi_regencies FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger untuk updated_at
CREATE TRIGGER update_demografi_countries_updated_at BEFORE UPDATE ON public.demografi_countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demografi_provinces_updated_at BEFORE UPDATE ON public.demografi_provinces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demografi_regencies_updated_at BEFORE UPDATE ON public.demografi_regencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.demografi_countries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.demografi_provinces;
ALTER PUBLICATION supabase_realtime ADD TABLE public.demografi_regencies;
