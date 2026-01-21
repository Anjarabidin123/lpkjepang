
-- Create table for payment items configuration
CREATE TABLE public.item_pembayaran (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_item text NOT NULL,
  nominal_wajib decimal(16,2) NOT NULL DEFAULT 0,
  deskripsi text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for student payment obligations
CREATE TABLE public.kewajiban_pembayaran (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id uuid REFERENCES public.siswa(id) ON DELETE CASCADE NOT NULL,
  item_pembayaran_id uuid REFERENCES public.item_pembayaran(id) ON DELETE CASCADE NOT NULL,
  nominal_wajib decimal(16,2) NOT NULL DEFAULT 0,
  nominal_terbayar decimal(16,2) NOT NULL DEFAULT 0,
  sisa_kewajiban decimal(16,2) NOT NULL DEFAULT 0,
  status_lunas boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(siswa_id, item_pembayaran_id)
);

-- Add trigger for updated_at on item_pembayaran
CREATE TRIGGER update_item_pembayaran_updated_at
  BEFORE UPDATE ON public.item_pembayaran
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on kewajiban_pembayaran
CREATE TRIGGER update_kewajiban_pembayaran_updated_at
  BEFORE UPDATE ON public.kewajiban_pembayaran
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.item_pembayaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kewajiban_pembayaran ENABLE ROW LEVEL SECURITY;

-- Create policies for item_pembayaran
CREATE POLICY "Allow authenticated users to view item_pembayaran" 
  ON public.item_pembayaran 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert item_pembayaran" 
  ON public.item_pembayaran 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update item_pembayaran" 
  ON public.item_pembayaran 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete item_pembayaran" 
  ON public.item_pembayaran 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create policies for kewajiban_pembayaran
CREATE POLICY "Allow authenticated users to view kewajiban_pembayaran" 
  ON public.kewajiban_pembayaran 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert kewajiban_pembayaran" 
  ON public.kewajiban_pembayaran 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update kewajiban_pembayaran" 
  ON public.kewajiban_pembayaran 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete kewajiban_pembayaran" 
  ON public.kewajiban_pembayaran 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Add item_pembayaran_id to pembayaran table
ALTER TABLE public.pembayaran 
ADD COLUMN item_pembayaran_id uuid REFERENCES public.item_pembayaran(id);

-- Create function to update payment obligations when payment is made
CREATE OR REPLACE FUNCTION update_kewajiban_pembayaran()
RETURNS TRIGGER AS $$
BEGIN
  -- Update kewajiban_pembayaran when payment is inserted
  IF TG_OP = 'INSERT' AND NEW.item_pembayaran_id IS NOT NULL THEN
    INSERT INTO public.kewajiban_pembayaran (siswa_id, item_pembayaran_id, nominal_wajib, nominal_terbayar, sisa_kewajiban, status_lunas)
    SELECT 
      NEW.siswa_id,
      NEW.item_pembayaran_id,
      COALESCE(ip.nominal_wajib, 0),
      NEW.nominal,
      GREATEST(COALESCE(ip.nominal_wajib, 0) - NEW.nominal, 0),
      (COALESCE(ip.nominal_wajib, 0) - NEW.nominal) <= 0
    FROM public.item_pembayaran ip
    WHERE ip.id = NEW.item_pembayaran_id
    ON CONFLICT (siswa_id, item_pembayaran_id)
    DO UPDATE SET
      nominal_terbayar = kewajiban_pembayaran.nominal_terbayar + NEW.nominal,
      sisa_kewajiban = GREATEST(kewajiban_pembayaran.nominal_wajib - (kewajiban_pembayaran.nominal_terbayar + NEW.nominal), 0),
      status_lunas = (kewajiban_pembayaran.nominal_wajib - (kewajiban_pembayaran.nominal_terbayar + NEW.nominal)) <= 0,
      updated_at = now();
  END IF;

  -- Update kewajiban_pembayaran when payment is updated
  IF TG_OP = 'UPDATE' AND NEW.item_pembayaran_id IS NOT NULL THEN
    UPDATE public.kewajiban_pembayaran
    SET 
      nominal_terbayar = nominal_terbayar - COALESCE(OLD.nominal, 0) + NEW.nominal,
      sisa_kewajiban = GREATEST(nominal_wajib - (nominal_terbayar - COALESCE(OLD.nominal, 0) + NEW.nominal), 0),
      status_lunas = (nominal_wajib - (nominal_terbayar - COALESCE(OLD.nominal, 0) + NEW.nominal)) <= 0,
      updated_at = now()
    WHERE siswa_id = NEW.siswa_id AND item_pembayaran_id = NEW.item_pembayaran_id;
  END IF;

  -- Update kewajiban_pembayaran when payment is deleted
  IF TG_OP = 'DELETE' AND OLD.item_pembayaran_id IS NOT NULL THEN
    UPDATE public.kewajiban_pembayaran
    SET 
      nominal_terbayar = nominal_terbayar - OLD.nominal,
      sisa_kewajiban = GREATEST(nominal_wajib - (nominal_terbayar - OLD.nominal), 0),
      status_lunas = (nominal_wajib - (nominal_terbayar - OLD.nominal)) <= 0,
      updated_at = now()
    WHERE siswa_id = OLD.siswa_id AND item_pembayaran_id = OLD.item_pembayaran_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for pembayaran table
CREATE TRIGGER update_kewajiban_pembayaran_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pembayaran
  FOR EACH ROW
  EXECUTE FUNCTION update_kewajiban_pembayaran();

-- Create indexes for better performance
CREATE INDEX idx_kewajiban_pembayaran_siswa_id ON public.kewajiban_pembayaran(siswa_id);
CREATE INDEX idx_kewajiban_pembayaran_item_id ON public.kewajiban_pembayaran(item_pembayaran_id);
CREATE INDEX idx_pembayaran_item_pembayaran_id ON public.pembayaran(item_pembayaran_id);
