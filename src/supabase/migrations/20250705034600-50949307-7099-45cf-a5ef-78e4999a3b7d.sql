
-- Fase 1: Buat struktur database terpusat untuk Demografi

-- 1. Tabel negara terpusat
CREATE TABLE public.demografi_countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  local_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabel provinsi terpusat 
CREATE TABLE public.demografi_provinces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL REFERENCES public.demografi_countries(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  local_name TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(country_id, code)
);

-- 3. Tabel kabupaten/regency terpusat
CREATE TABLE public.demografi_regencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  province_id UUID NOT NULL REFERENCES public.demografi_provinces(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  local_name TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(province_id, code)
);

-- 4. Insert data negara
INSERT INTO public.demografi_countries (code, name, local_name) VALUES
('ID', 'Indonesia', 'Indonesia'),
('JP', 'Japan', '日本');

-- 5. Migrate data provinsi dari tabel lama
INSERT INTO public.demografi_provinces (country_id, code, name, is_active)
SELECT 
  (SELECT id FROM public.demografi_countries WHERE code = 'ID'),
  p.kode,
  p.nama,
  CASE WHEN p.status = 'Aktif' THEN true ELSE false END
FROM public.provinsi_indonesia p;

INSERT INTO public.demografi_provinces (country_id, code, name, is_active)
SELECT 
  (SELECT id FROM public.demografi_countries WHERE code = CASE WHEN pr.negara = 'Jepang' THEN 'JP' ELSE 'ID' END),
  pr.kode,
  pr.nama,
  CASE WHEN pr.status = 'Aktif' THEN true ELSE false END
FROM public.provinsi pr
WHERE pr.negara = 'Jepang';

-- 6. Migrate data kabupaten dari tabel lama
INSERT INTO public.demografi_regencies (province_id, code, name, is_active)
SELECT 
  dp.id,
  k.kode,
  k.nama,
  true
FROM public.kabupaten_indonesia k
JOIN public.provinsi_indonesia pi ON k.provinsi_id = pi.id
JOIN public.demografi_provinces dp ON dp.code = pi.kode AND dp.country_id = (SELECT id FROM public.demografi_countries WHERE code = 'ID');

INSERT INTO public.demografi_regencies (province_id, code, name, is_active)
SELECT 
  dp.id,
  kb.kode,
  kb.nama,
  CASE WHEN kb.status = 'Aktif' THEN true ELSE false END
FROM public.kabupaten kb
JOIN public.provinsi pr ON kb.provinsi_id = pr.id
JOIN public.demografi_provinces dp ON dp.code = pr.kode AND dp.country_id = (SELECT id FROM public.demografi_countries WHERE code = CASE WHEN pr.negara = 'Jepang' THEN 'JP' ELSE 'ID' END);

-- 7. Add indexes untuk performance
CREATE INDEX idx_demografi_provinces_country ON public.demografi_provinces(country_id);
CREATE INDEX idx_demografi_provinces_active ON public.demografi_provinces(is_active);
CREATE INDEX idx_demografi_regencies_province ON public.demografi_regencies(province_id);
CREATE INDEX idx_demografi_regencies_active ON public.demografi_regencies(is_active);

-- 8. Enable RLS
ALTER TABLE public.demografi_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demografi_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demografi_regencies ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies
CREATE POLICY "Allow authenticated users to view countries" ON public.demografi_countries FOR SELECT USING (true);
CREATE POLICY "Admins can manage countries" ON public.demografi_countries FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow authenticated users to view provinces" ON public.demografi_provinces FOR SELECT USING (true);
CREATE POLICY "Admins can manage provinces" ON public.demografi_provinces FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow authenticated users to view regencies" ON public.demografi_regencies FOR SELECT USING (true);
CREATE POLICY "Admins can manage regencies" ON public.demografi_regencies FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 10. Add trigger untuk updated_at
CREATE TRIGGER update_demografi_countries_updated_at BEFORE UPDATE ON public.demografi_countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demografi_provinces_updated_at BEFORE UPDATE ON public.demografi_provinces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demografi_regencies_updated_at BEFORE UPDATE ON public.demografi_regencies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.demografi_countries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.demografi_provinces;
ALTER PUBLICATION supabase_realtime ADD TABLE public.demografi_regencies;
