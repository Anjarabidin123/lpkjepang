
-- Add missing hooks for demografi countries
CREATE OR REPLACE FUNCTION public.get_demografi_countries()
RETURNS TABLE(
  id UUID,
  kode TEXT,
  nama TEXT,
  nama_lokal TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT id, kode, nama, nama_lokal, is_active, created_at, updated_at
  FROM public.demografi_countries
  WHERE is_active = true
  ORDER BY nama;
$$;

-- Update RLS policies for better integration
DROP POLICY IF EXISTS "Allow authenticated users to view countries" ON public.demografi_countries;
CREATE POLICY "Allow authenticated users to view countries" ON public.demografi_countries 
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to view provinces" ON public.demografi_provinces;
CREATE POLICY "Allow authenticated users to view provinces" ON public.demografi_provinces 
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to view regencies" ON public.demografi_regencies;
CREATE POLICY "Allow authenticated users to view regencies" ON public.demografi_regencies 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Ensure proper indexing for performance
CREATE INDEX IF NOT EXISTS idx_siswa_demografi_fields ON public.siswa(demografi_province_id, demografi_regency_id);
CREATE INDEX IF NOT EXISTS idx_siswa_magang_demografi_fields ON public.siswa_magang(demografi_province_id, demografi_regency_id);

-- Add function to get provinces by country
CREATE OR REPLACE FUNCTION public.get_provinces_by_country(country_code TEXT DEFAULT 'ID')
RETURNS TABLE(
  id UUID,
  country_id UUID,
  kode TEXT,
  nama TEXT,
  nama_lokal TEXT,
  sort_order INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT p.id, p.country_id, p.kode, p.nama, p.nama_lokal, p.sort_order
  FROM public.demografi_provinces p
  JOIN public.demografi_countries c ON p.country_id = c.id
  WHERE c.kode = country_code AND p.is_active = true
  ORDER BY p.sort_order, p.nama;
$$;

-- Add function to get regencies by province
CREATE OR REPLACE FUNCTION public.get_regencies_by_province(province_id_param UUID)
RETURNS TABLE(
  id UUID,
  province_id UUID,
  kode TEXT,
  nama TEXT,
  nama_lokal TEXT,
  sort_order INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT id, province_id, kode, nama, nama_lokal, sort_order
  FROM public.demografi_regencies
  WHERE province_id = province_id_param AND is_active = true
  ORDER BY sort_order, nama;
$$;
