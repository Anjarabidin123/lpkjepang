
-- Create table for expense categories
CREATE TABLE public.kategori_pengeluaran (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kategori text NOT NULL,
  deskripsi text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for expense records
CREATE TABLE public.pengeluaran (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kategori_id uuid REFERENCES public.kategori_pengeluaran(id) ON DELETE SET NULL,
  nama_pengeluaran text NOT NULL,
  nominal numeric(16,2) NOT NULL,
  tanggal_pengeluaran date NOT NULL DEFAULT CURRENT_DATE,
  keterangan text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add triggers for updated_at
CREATE TRIGGER update_kategori_pengeluaran_updated_at
  BEFORE UPDATE ON public.kategori_pengeluaran
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pengeluaran_updated_at
  BEFORE UPDATE ON public.pengeluaran
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.kategori_pengeluaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengeluaran ENABLE ROW LEVEL SECURITY;

-- Create policies for kategori_pengeluaran
CREATE POLICY "Allow authenticated users to view kategori_pengeluaran" 
  ON public.kategori_pengeluaran 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert kategori_pengeluaran" 
  ON public.kategori_pengeluaran 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update kategori_pengeluaran" 
  ON public.kategori_pengeluaran 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete kategori_pengeluaran" 
  ON public.kategori_pengeluaran 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create policies for pengeluaran
CREATE POLICY "Allow authenticated users to view pengeluaran" 
  ON public.pengeluaran 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert pengeluaran" 
  ON public.pengeluaran 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update pengeluaran" 
  ON public.pengeluaran 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete pengeluaran" 
  ON public.pengeluaran 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_pengeluaran_kategori_id ON public.pengeluaran(kategori_id);
CREATE INDEX idx_pengeluaran_tanggal ON public.pengeluaran(tanggal_pengeluaran);
CREATE INDEX idx_kategori_pengeluaran_active ON public.kategori_pengeluaran(is_active);

-- Insert default expense categories
INSERT INTO public.kategori_pengeluaran (nama_kategori, deskripsi) VALUES
('Operasional', 'Pengeluaran operasional harian'),
('Administrasi', 'Biaya administrasi dan dokumentasi'),
('Transportasi', 'Biaya transportasi dan perjalanan'),
('Pelatihan', 'Biaya pelatihan dan pendidikan'),
('Lain-lain', 'Pengeluaran lainnya');

-- Create function to automatically update arus_kas when pengeluaran is modified
CREATE OR REPLACE FUNCTION public.sync_pengeluaran_to_arus_kas()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.arus_kas (
      jenis, 
      kategori, 
      nominal, 
      tanggal, 
      keterangan, 
      referensi_tabel, 
      referensi_id
    ) VALUES (
      'Pengeluaran',
      COALESCE((SELECT nama_kategori FROM public.kategori_pengeluaran WHERE id = NEW.kategori_id), 'Lain-lain'),
      NEW.nominal,
      NEW.tanggal_pengeluaran,
      NEW.nama_pengeluaran || CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      'pengeluaran',
      NEW.id
    );
    RETURN NEW;
  END IF;
  
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    UPDATE public.arus_kas SET
      kategori = COALESCE((SELECT nama_kategori FROM public.kategori_pengeluaran WHERE id = NEW.kategori_id), 'Lain-lain'),
      nominal = NEW.nominal,
      tanggal = NEW.tanggal_pengeluaran,
      keterangan = NEW.nama_pengeluaran || CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      updated_at = now()
    WHERE referensi_tabel = 'pengeluaran' AND referensi_id = NEW.id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.arus_kas 
    WHERE referensi_tabel = 'pengeluaran' AND referensi_id = OLD.id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for pengeluaran sync
CREATE TRIGGER sync_pengeluaran_to_arus_kas_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pengeluaran
  FOR EACH ROW
  EXECUTE FUNCTION sync_pengeluaran_to_arus_kas();

-- Create function to sync internal_payments to arus_kas
CREATE OR REPLACE FUNCTION public.sync_internal_payment_to_arus_kas()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.arus_kas (
      jenis, 
      kategori, 
      nominal, 
      tanggal, 
      keterangan, 
      referensi_tabel, 
      referensi_id
    ) VALUES (
      'Pemasukan',
      'Internal Payment',
      NEW.nominal,
      NEW.tanggal_pembayaran,
      COALESCE((SELECT nama_item FROM public.item_pembayaran WHERE id = NEW.item_pembayaran_id), 'Pembayaran') || 
      CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      'internal_payments',
      NEW.id
    );
    RETURN NEW;
  END IF;
  
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    UPDATE public.arus_kas SET
      nominal = NEW.nominal,
      tanggal = NEW.tanggal_pembayaran,
      keterangan = COALESCE((SELECT nama_item FROM public.item_pembayaran WHERE id = NEW.item_pembayaran_id), 'Pembayaran') || 
                   CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      updated_at = now()
    WHERE referensi_tabel = 'internal_payments' AND referensi_id = NEW.id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.arus_kas 
    WHERE referensi_tabel = 'internal_payments' AND referensi_id = OLD.id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for internal_payments sync
CREATE TRIGGER sync_internal_payment_to_arus_kas_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.internal_payments
  FOR EACH ROW
  EXECUTE FUNCTION sync_internal_payment_to_arus_kas();
