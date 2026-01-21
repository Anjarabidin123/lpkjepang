
-- Create invoice_settings table
CREATE TABLE public.invoice_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kumiai_id UUID NOT NULL REFERENCES public.kumiai(id) ON DELETE CASCADE,
  item_pembayaran TEXT NOT NULL,
  nominal_base NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(kumiai_id, item_pembayaran)
);

-- Add RLS policies for invoice_settings
ALTER TABLE public.invoice_settings ENABLE ROW LEVEL SECURITY;

-- Policy to allow all authenticated users to view invoice settings
CREATE POLICY "Allow authenticated users to view invoice settings" 
  ON public.invoice_settings 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Policy to allow all authenticated users to insert invoice settings
CREATE POLICY "Allow authenticated users to insert invoice settings" 
  ON public.invoice_settings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Policy to allow all authenticated users to update invoice settings
CREATE POLICY "Allow authenticated users to update invoice settings" 
  ON public.invoice_settings 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Policy to allow all authenticated users to delete invoice settings
CREATE POLICY "Allow authenticated users to delete invoice settings" 
  ON public.invoice_settings 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_invoice_settings_updated_at
  BEFORE UPDATE ON public.invoice_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
