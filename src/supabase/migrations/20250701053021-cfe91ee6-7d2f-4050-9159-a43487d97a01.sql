
-- Create internal_payments table for the new Internal Payment module
CREATE TABLE public.internal_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siswa_id uuid REFERENCES public.siswa(id) ON DELETE CASCADE NOT NULL,
  item_pembayaran_id uuid REFERENCES public.item_pembayaran(id) ON DELETE CASCADE NOT NULL,
  nominal decimal(16,2) NOT NULL,
  tanggal_pembayaran date NOT NULL DEFAULT CURRENT_DATE,
  metode_pembayaran text DEFAULT 'Tunai',
  status text DEFAULT 'Lunas',
  keterangan text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER update_internal_payments_updated_at
  BEFORE UPDATE ON public.internal_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.internal_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for internal_payments
CREATE POLICY "Allow authenticated users to view internal_payments" 
  ON public.internal_payments 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert internal_payments" 
  ON public.internal_payments 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update internal_payments" 
  ON public.internal_payments 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete internal_payments" 
  ON public.internal_payments 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create function to update payment status automatically
CREATE OR REPLACE FUNCTION public.auto_update_internal_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically set status based on nominal comparison with item_pembayaran
  IF NEW.item_pembayaran_id IS NOT NULL THEN
    SELECT CASE 
      WHEN NEW.nominal >= ip.nominal_wajib THEN 'Lunas'
      ELSE 'Belum Lunas'
    END INTO NEW.status
    FROM public.item_pembayaran ip
    WHERE ip.id = NEW.item_pembayaran_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic status update
CREATE TRIGGER auto_update_internal_payment_status_trigger
  BEFORE INSERT OR UPDATE ON public.internal_payments
  FOR EACH ROW
  EXECUTE FUNCTION auto_update_internal_payment_status();

-- Create indexes for better performance
CREATE INDEX idx_internal_payments_siswa_id ON public.internal_payments(siswa_id);
CREATE INDEX idx_internal_payments_item_pembayaran_id ON public.internal_payments(item_pembayaran_id);
CREATE INDEX idx_internal_payments_tanggal ON public.internal_payments(tanggal_pembayaran);
