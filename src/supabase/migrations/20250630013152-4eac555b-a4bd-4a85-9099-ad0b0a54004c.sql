
-- Create junction table for invoice items (siswa magang in an invoice)
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid REFERENCES public.invoice(id) ON DELETE CASCADE NOT NULL,
  siswa_magang_id uuid REFERENCES public.siswa_magang(id) ON DELETE CASCADE NOT NULL,
  nominal_fee decimal(15,2) NOT NULL,
  keterangan text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER update_invoice_items_updated_at
  BEFORE UPDATE ON public.invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies for invoice_items
CREATE POLICY "Allow authenticated users to view invoice_items" 
  ON public.invoice_items 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert invoice_items" 
  ON public.invoice_items 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update invoice_items" 
  ON public.invoice_items 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete invoice_items" 
  ON public.invoice_items 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_siswa_magang_id ON public.invoice_items(siswa_magang_id);

-- Modify invoice table to remove single siswa_magang_id since we now use junction table
ALTER TABLE public.invoice DROP COLUMN siswa_magang_id;

-- Add function to calculate total invoice amount from items
CREATE OR REPLACE FUNCTION calculate_invoice_total(invoice_uuid uuid)
RETURNS decimal(15,2)
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(SUM(nominal_fee), 0)
  FROM public.invoice_items
  WHERE invoice_id = invoice_uuid;
$$;
