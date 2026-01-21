
-- Create table for income categories (kategori pemasukan)
CREATE TABLE public.kategori_pemasukan (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_kategori text NOT NULL,
  deskripsi text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for income records (pemasukan)
CREATE TABLE public.pemasukan (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kategori_id uuid REFERENCES public.kategori_pemasukan(id) ON DELETE SET NULL,
  nama_pemasukan text NOT NULL,
  nominal numeric(16,2) NOT NULL,
  tanggal_pemasukan date NOT NULL DEFAULT CURRENT_DATE,
  keterangan text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add triggers for updated_at
CREATE TRIGGER update_kategori_pemasukan_updated_at
  BEFORE UPDATE ON public.kategori_pemasukan
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pemasukan_updated_at
  BEFORE UPDATE ON public.pemasukan
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.kategori_pemasukan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pemasukan ENABLE ROW LEVEL SECURITY;

-- Create policies for kategori_pemasukan
CREATE POLICY "Allow authenticated users to view kategori_pemasukan" 
  ON public.kategori_pemasukan 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert kategori_pemasukan" 
  ON public.kategori_pemasukan 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update kategori_pemasukan" 
  ON public.kategori_pemasukan 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete kategori_pemasukan" 
  ON public.kategori_pemasukan 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create policies for pemasukan
CREATE POLICY "Allow authenticated users to view pemasukan" 
  ON public.pemasukan 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert pemasukan" 
  ON public.pemasukan 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update pemasukan" 
  ON public.pemasukan 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete pemasukan" 
  ON public.pemasukan 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_pemasukan_kategori_id ON public.pemasukan(kategori_id);
CREATE INDEX idx_pemasukan_tanggal ON public.pemasukan(tanggal_pemasukan);
CREATE INDEX idx_kategori_pemasukan_active ON public.kategori_pemasukan(is_active);

-- Insert default income categories
INSERT INTO public.kategori_pemasukan (nama_kategori, deskripsi) VALUES
('Pendapatan Usaha', 'Pendapatan dari kegiatan operasional utama'),
('Investasi', 'Hasil dari investasi dan bunga'),
('Hibah', 'Dana hibah dan bantuan'),
('Konsultasi', 'Pendapatan dari jasa konsultasi'),
('Lain-lain', 'Pemasukan lainnya');

-- Create function to automatically update arus_kas when pemasukan is modified
CREATE OR REPLACE FUNCTION public.sync_pemasukan_to_arus_kas()
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
      COALESCE((SELECT nama_kategori FROM public.kategori_pemasukan WHERE id = NEW.kategori_id), 'Lain-lain'),
      NEW.nominal,
      NEW.tanggal_pemasukan,
      NEW.nama_pemasukan || CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      'pemasukan',
      NEW.id
    );
    RETURN NEW;
  END IF;
  
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    UPDATE public.arus_kas SET
      kategori = COALESCE((SELECT nama_kategori FROM public.kategori_pemasukan WHERE id = NEW.kategori_id), 'Lain-lain'),
      nominal = NEW.nominal,
      tanggal = NEW.tanggal_pemasukan,
      keterangan = NEW.nama_pemasukan || CASE WHEN NEW.keterangan IS NOT NULL THEN ' - ' || NEW.keterangan ELSE '' END,
      updated_at = now()
    WHERE referensi_tabel = 'pemasukan' AND referensi_id = NEW.id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.arus_kas 
    WHERE referensi_tabel = 'pemasukan' AND referensi_id = OLD.id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for pemasukan sync
CREATE TRIGGER sync_pemasukan_to_arus_kas_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pemasukan
  FOR EACH ROW
  EXECUTE FUNCTION sync_pemasukan_to_arus_kas();
