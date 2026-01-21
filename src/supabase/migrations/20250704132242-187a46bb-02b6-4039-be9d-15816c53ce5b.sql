
-- Create Journal table for recording journal entries
CREATE TABLE public.journal (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal date NOT NULL DEFAULT CURRENT_DATE,
  kode_jurnal text NOT NULL,
  deskripsi text NOT NULL,
  referensi text,
  total_debit numeric(16,2) NOT NULL DEFAULT 0,
  total_kredit numeric(16,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'Draft',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create Journal Detail table for double-entry bookkeeping
CREATE TABLE public.journal_detail (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id uuid REFERENCES public.journal(id) ON DELETE CASCADE NOT NULL,
  akun_id uuid REFERENCES public.chart_of_accounts(id) ON DELETE CASCADE NOT NULL,
  deskripsi text,
  debit numeric(16,2) DEFAULT 0,
  kredit numeric(16,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create Chart of Accounts table for accounting structure
CREATE TABLE public.chart_of_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kode_akun text NOT NULL UNIQUE,
  nama_akun text NOT NULL,
  jenis_akun text NOT NULL, -- 'Aset', 'Kewajiban', 'Ekuitas', 'Pendapatan', 'Beban'
  kategori text,
  parent_id uuid REFERENCES public.chart_of_accounts(id),
  saldo_normal text NOT NULL DEFAULT 'Debit', -- 'Debit' or 'Kredit'
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create Financial Report Templates table
CREATE TABLE public.financial_report_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_template text NOT NULL,
  jenis_laporan text NOT NULL, -- 'Balance Sheet', 'Income Statement', 'Cash Flow'
  template_config jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add triggers for updated_at
CREATE TRIGGER update_journal_updated_at
  BEFORE UPDATE ON public.journal
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_detail_updated_at
  BEFORE UPDATE ON public.journal_detail
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chart_of_accounts_updated_at
  BEFORE UPDATE ON public.chart_of_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_report_templates_updated_at
  BEFORE UPDATE ON public.financial_report_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_report_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for journal
CREATE POLICY "Allow authenticated users to view journal" 
  ON public.journal 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert journal" 
  ON public.journal 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update journal" 
  ON public.journal 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete journal" 
  ON public.journal 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create RLS policies for journal_detail
CREATE POLICY "Allow authenticated users to view journal_detail" 
  ON public.journal_detail 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert journal_detail" 
  ON public.journal_detail 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update journal_detail" 
  ON public.journal_detail 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete journal_detail" 
  ON public.journal_detail 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create RLS policies for chart_of_accounts
CREATE POLICY "Allow authenticated users to view chart_of_accounts" 
  ON public.chart_of_accounts 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert chart_of_accounts" 
  ON public.chart_of_accounts 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update chart_of_accounts" 
  ON public.chart_of_accounts 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete chart_of_accounts" 
  ON public.chart_of_accounts 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create RLS policies for financial_report_templates
CREATE POLICY "Allow authenticated users to view financial_report_templates" 
  ON public.financial_report_templates 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert financial_report_templates" 
  ON public.financial_report_templates 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update financial_report_templates" 
  ON public.financial_report_templates 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete financial_report_templates" 
  ON public.financial_report_templates 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_journal_tanggal ON public.journal(tanggal);
CREATE INDEX idx_journal_kode_jurnal ON public.journal(kode_jurnal);
CREATE INDEX idx_journal_detail_journal_id ON public.journal_detail(journal_id);
CREATE INDEX idx_journal_detail_akun_id ON public.journal_detail(akun_id);
CREATE INDEX idx_chart_of_accounts_kode_akun ON public.chart_of_accounts(kode_akun);
CREATE INDEX idx_chart_of_accounts_parent_id ON public.chart_of_accounts(parent_id);

-- Insert default Chart of Accounts
INSERT INTO public.chart_of_accounts (kode_akun, nama_akun, jenis_akun, kategori, saldo_normal) VALUES
-- Aset
('1000', 'Aset', 'Aset', 'Header', 'Debit'),
('1100', 'Aset Lancar', 'Aset', 'Subheader', 'Debit'),
('1101', 'Kas', 'Aset', 'Detail', 'Debit'),
('1102', 'Bank', 'Aset', 'Detail', 'Debit'),
('1103', 'Piutang Usaha', 'Aset', 'Detail', 'Debit'),

-- Kewajiban
('2000', 'Kewajiban', 'Kewajiban', 'Header', 'Kredit'),
('2100', 'Kewajiban Lancar', 'Kewajiban', 'Subheader', 'Kredit'),
('2101', 'Utang Usaha', 'Kewajiban', 'Detail', 'Kredit'),
('2102', 'Utang Gaji', 'Kewajiban', 'Detail', 'Kredit'),

-- Ekuitas
('3000', 'Ekuitas', 'Ekuitas', 'Header', 'Kredit'),
('3101', 'Modal', 'Ekuitas', 'Detail', 'Kredit'),
('3102', 'Laba Ditahan', 'Ekuitas', 'Detail', 'Kredit'),

-- Pendapatan
('4000', 'Pendapatan', 'Pendapatan', 'Header', 'Kredit'),
('4101', 'Pendapatan Jasa', 'Pendapatan', 'Detail', 'Kredit'),
('4102', 'Pendapatan Lain-lain', 'Pendapatan', 'Detail', 'Kredit'),

-- Beban
('5000', 'Beban', 'Beban', 'Header', 'Debit'),
('5101', 'Beban Gaji', 'Beban', 'Detail', 'Debit'),
('5102', 'Beban Operasional', 'Beban', 'Detail', 'Debit'),
('5103', 'Beban Administrasi', 'Beban', 'Detail', 'Debit');

-- Function to validate journal entry balance
CREATE OR REPLACE FUNCTION public.validate_journal_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total debit and kredit in journal header
  UPDATE public.journal SET
    total_debit = (
      SELECT COALESCE(SUM(debit), 0) 
      FROM public.journal_detail 
      WHERE journal_id = NEW.journal_id
    ),
    total_kredit = (
      SELECT COALESCE(SUM(kredit), 0) 
      FROM public.journal_detail 
      WHERE journal_id = NEW.journal_id
    ),
    updated_at = now()
  WHERE id = NEW.journal_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for journal balance validation
CREATE TRIGGER validate_journal_balance_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.journal_detail
  FOR EACH ROW
  EXECUTE FUNCTION validate_journal_balance();

-- Function to auto-sync journal entries to arus_kas
CREATE OR REPLACE FUNCTION public.sync_journal_to_arus_kas()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT/UPDATE for journal
  IF TG_OP IN ('INSERT', 'UPDATE') AND NEW.status = 'Posted' THEN
    -- Delete existing arus_kas entries for this journal
    DELETE FROM public.arus_kas 
    WHERE referensi_tabel = 'journal' AND referensi_id = NEW.id;
    
    -- Insert new arus_kas entries from journal details
    INSERT INTO public.arus_kas (
      jenis, 
      kategori, 
      nominal, 
      tanggal, 
      keterangan, 
      referensi_tabel, 
      referensi_id
    )
    SELECT 
      CASE 
        WHEN coa.jenis_akun = 'Pendapatan' THEN 'Pemasukan'
        WHEN coa.jenis_akun = 'Beban' THEN 'Pengeluaran'
        ELSE 'Lainnya'
      END as jenis,
      coa.nama_akun as kategori,
      CASE 
        WHEN coa.jenis_akun = 'Pendapatan' THEN jd.kredit
        WHEN coa.jenis_akun = 'Beban' THEN jd.debit
        ELSE GREATEST(jd.debit, jd.kredit)
      END as nominal,
      NEW.tanggal,
      NEW.deskripsi || ' - ' || COALESCE(jd.deskripsi, ''),
      'journal',
      NEW.id
    FROM public.journal_detail jd
    JOIN public.chart_of_accounts coa ON jd.akun_id = coa.id
    WHERE jd.journal_id = NEW.id
      AND coa.jenis_akun IN ('Pendapatan', 'Beban')
      AND (jd.debit > 0 OR jd.kredit > 0);
      
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.arus_kas 
    WHERE referensi_tabel = 'journal' AND referensi_id = OLD.id;
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for journal to arus_kas sync
CREATE TRIGGER sync_journal_to_arus_kas_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.journal
  FOR EACH ROW
  EXECUTE FUNCTION sync_journal_to_arus_kas();
