
-- Add photo field to siswa table
ALTER TABLE public.siswa ADD COLUMN foto_siswa TEXT;

-- Create table for Indonesian provinces
CREATE TABLE IF NOT EXISTS public.provinsi_indonesia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for Indonesian regencies/cities
CREATE TABLE IF NOT EXISTS public.kabupaten_indonesia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  provinsi_id UUID NOT NULL REFERENCES public.provinsi_indonesia(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add province and regency fields to siswa table
ALTER TABLE public.siswa ADD COLUMN provinsi_indonesia_id UUID REFERENCES public.provinsi_indonesia(id);
ALTER TABLE public.siswa ADD COLUMN kabupaten_indonesia_id UUID REFERENCES public.kabupaten_indonesia(id);

-- Enable RLS for new tables
ALTER TABLE public.provinsi_indonesia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kabupaten_indonesia ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for provinsi_indonesia
CREATE POLICY "All authenticated users can view provinsi_indonesia"
  ON public.provinsi_indonesia FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage provinsi_indonesia"
  ON public.provinsi_indonesia FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for kabupaten_indonesia
CREATE POLICY "All authenticated users can view kabupaten_indonesia"
  ON public.kabupaten_indonesia FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage kabupaten_indonesia"
  ON public.kabupaten_indonesia FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample Indonesian provinces
INSERT INTO public.provinsi_indonesia (kode, nama) VALUES
('11', 'Aceh'),
('12', 'Sumatera Utara'),
('13', 'Sumatera Barat'),
('14', 'Riau'),
('15', 'Jambi'),
('16', 'Sumatera Selatan'),
('17', 'Bengkulu'),
('18', 'Lampung'),
('19', 'Kepulauan Bangka Belitung'),
('21', 'Kepulauan Riau'),
('31', 'DKI Jakarta'),
('32', 'Jawa Barat'),
('33', 'Jawa Tengah'),
('34', 'DI Yogyakarta'),
('35', 'Jawa Timur'),
('36', 'Banten'),
('51', 'Bali'),
('52', 'Nusa Tenggara Barat'),
('53', 'Nusa Tenggara Timur'),
('61', 'Kalimantan Barat'),
('62', 'Kalimantan Tengah'),
('63', 'Kalimantan Selatan'),
('64', 'Kalimantan Timur'),
('65', 'Kalimantan Utara'),
('71', 'Sulawesi Utara'),
('72', 'Sulawesi Tengah'),
('73', 'Sulawesi Selatan'),
('74', 'Sulawesi Tenggara'),
('75', 'Gorontalo'),
('76', 'Sulawesi Barat'),
('81', 'Maluku'),
('82', 'Maluku Utara'),
('91', 'Papua Barat'),
('94', 'Papua');

-- Insert sample regencies for major provinces (Jakarta, West Java, Central Java, East Java)
INSERT INTO public.kabupaten_indonesia (kode, nama, provinsi_id) 
SELECT '3171', 'Jakarta Selatan', id FROM public.provinsi_indonesia WHERE kode = '31'
UNION ALL
SELECT '3172', 'Jakarta Timur', id FROM public.provinsi_indonesia WHERE kode = '31'
UNION ALL
SELECT '3173', 'Jakarta Pusat', id FROM public.provinsi_indonesia WHERE kode = '31'
UNION ALL
SELECT '3174', 'Jakarta Barat', id FROM public.provinsi_indonesia WHERE kode = '31'
UNION ALL
SELECT '3175', 'Jakarta Utara', id FROM public.provinsi_indonesia WHERE kode = '31'
UNION ALL
SELECT '3201', 'Kabupaten Bogor', id FROM public.provinsi_indonesia WHERE kode = '32'
UNION ALL
SELECT '3271', 'Kota Bogor', id FROM public.provinsi_indonesia WHERE kode = '32'
UNION ALL
SELECT '3273', 'Kota Bandung', id FROM public.provinsi_indonesia WHERE kode = '32'
UNION ALL
SELECT '3301', 'Kabupaten Cilacap', id FROM public.provinsi_indonesia WHERE kode = '33'
UNION ALL
SELECT '3371', 'Kota Magelang', id FROM public.provinsi_indonesia WHERE kode = '33'
UNION ALL
SELECT '3501', 'Kabupaten Pacitan', id FROM public.provinsi_indonesia WHERE kode = '35'
UNION ALL
SELECT '3578', 'Kota Surabaya', id FROM public.provinsi_indonesia WHERE kode = '35';
