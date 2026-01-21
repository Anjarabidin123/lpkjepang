
-- Create table for Pembayaran (Student Education Payments)
CREATE TABLE public.pembayaran (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id uuid REFERENCES public.siswa(id) ON DELETE CASCADE NOT NULL,
  nominal decimal(15,2) NOT NULL,
  tanggal_pembayaran date NOT NULL DEFAULT CURRENT_DATE,
  keterangan text,
  metode_pembayaran text DEFAULT 'Tunai',
  status text DEFAULT 'Lunas',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for Invoice (Management Fee Invoices to Kumiai)
CREATE TABLE public.invoice (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_magang_id uuid REFERENCES public.siswa_magang(id) ON DELETE CASCADE NOT NULL,
  kumiai_id uuid REFERENCES public.kumiai(id) ON DELETE CASCADE NOT NULL,
  nomor_invoice text NOT NULL,
  nominal decimal(15,2) NOT NULL,
  tanggal_invoice date NOT NULL DEFAULT CURRENT_DATE,
  tanggal_jatuh_tempo date,
  keterangan text,
  status text DEFAULT 'Pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create table for Arus Kas (Cash Flow)
CREATE TABLE public.arus_kas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jenis text NOT NULL, -- 'Pemasukan' or 'Pengeluaran'
  kategori text NOT NULL,
  nominal decimal(15,2) NOT NULL,
  tanggal date NOT NULL DEFAULT CURRENT_DATE,
  keterangan text,
  referensi_id uuid, -- Reference to related record (pembayaran_id, invoice_id, etc)
  referensi_tabel text, -- Table name of the reference
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add triggers for updated_at
CREATE TRIGGER update_pembayaran_updated_at
  BEFORE UPDATE ON public.pembayaran
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoice_updated_at
  BEFORE UPDATE ON public.invoice
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_arus_kas_updated_at
  BEFORE UPDATE ON public.arus_kas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.pembayaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arus_kas ENABLE ROW LEVEL SECURITY;

-- Create policies for pembayaran
CREATE POLICY "Allow authenticated users to view pembayaran" 
  ON public.pembayaran 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert pembayaran" 
  ON public.pembayaran 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update pembayaran" 
  ON public.pembayaran 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete pembayaran" 
  ON public.pembayaran 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create policies for invoice
CREATE POLICY "Allow authenticated users to view invoice" 
  ON public.invoice 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert invoice" 
  ON public.invoice 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update invoice" 
  ON public.invoice 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete invoice" 
  ON public.invoice 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create policies for arus_kas
CREATE POLICY "Allow authenticated users to view arus_kas" 
  ON public.arus_kas 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert arus_kas" 
  ON public.arus_kas 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update arus_kas" 
  ON public.arus_kas 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete arus_kas" 
  ON public.arus_kas 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_pembayaran_siswa_id ON public.pembayaran(siswa_id);
CREATE INDEX idx_pembayaran_tanggal ON public.pembayaran(tanggal_pembayaran);

CREATE INDEX idx_invoice_siswa_magang_id ON public.invoice(siswa_magang_id);
CREATE INDEX idx_invoice_kumiai_id ON public.invoice(kumiai_id);
CREATE INDEX idx_invoice_tanggal ON public.invoice(tanggal_invoice);
CREATE INDEX idx_invoice_nomor ON public.invoice(nomor_invoice);

CREATE INDEX idx_arus_kas_jenis ON public.arus_kas(jenis);
CREATE INDEX idx_arus_kas_tanggal ON public.arus_kas(tanggal);
CREATE INDEX idx_arus_kas_referensi ON public.arus_kas(referensi_id, referensi_tabel);
