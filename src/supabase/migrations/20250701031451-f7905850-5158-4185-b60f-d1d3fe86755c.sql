
-- Enable RLS on all financial tables if not already enabled
ALTER TABLE public.pembayaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arus_kas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_pembayaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kewajiban_pembayaran ENABLE ROW LEVEL SECURITY;

-- Create policies for pembayaran table
DROP POLICY IF EXISTS "Allow authenticated users to view pembayaran" ON public.pembayaran;
DROP POLICY IF EXISTS "Allow authenticated users to insert pembayaran" ON public.pembayaran;
DROP POLICY IF EXISTS "Allow authenticated users to update pembayaran" ON public.pembayaran;
DROP POLICY IF EXISTS "Allow authenticated users to delete pembayaran" ON public.pembayaran;

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

-- Create policies for arus_kas table
DROP POLICY IF EXISTS "Allow authenticated users to view arus_kas" ON public.arus_kas;
DROP POLICY IF EXISTS "Allow authenticated users to insert arus_kas" ON public.arus_kas;
DROP POLICY IF EXISTS "Allow authenticated users to update arus_kas" ON public.arus_kas;
DROP POLICY IF EXISTS "Allow authenticated users to delete arus_kas" ON public.arus_kas;

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

-- Create policies for item_pembayaran table
DROP POLICY IF EXISTS "Allow authenticated users to view item_pembayaran" ON public.item_pembayaran;
DROP POLICY IF EXISTS "Allow authenticated users to insert item_pembayaran" ON public.item_pembayaran;
DROP POLICY IF EXISTS "Allow authenticated users to update item_pembayaran" ON public.item_pembayaran;
DROP POLICY IF EXISTS "Allow authenticated users to delete item_pembayaran" ON public.item_pembayaran;

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

-- Create policies for kewajiban_pembayaran table
DROP POLICY IF EXISTS "Allow authenticated users to view kewajiban_pembayaran" ON public.kewajiban_pembayaran;
DROP POLICY IF EXISTS "Allow authenticated users to insert kewajiban_pembayaran" ON public.kewajiban_pembayaran;
DROP POLICY IF EXISTS "Allow authenticated users to update kewajiban_pembayaran" ON public.kewajiban_pembayaran;
DROP POLICY IF EXISTS "Allow authenticated users to delete kewajiban_pembayaran" ON public.kewajiban_pembayaran;

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
