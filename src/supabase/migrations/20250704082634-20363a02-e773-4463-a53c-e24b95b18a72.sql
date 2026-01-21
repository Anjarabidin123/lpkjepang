
-- Enable RLS for lpk_mitra table
ALTER TABLE public.lpk_mitra ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lpk_mitra
CREATE POLICY "Allow authenticated users to view lpk_mitra" 
  ON public.lpk_mitra 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated users to insert lpk_mitra" 
  ON public.lpk_mitra 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update lpk_mitra" 
  ON public.lpk_mitra 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow authenticated users to delete lpk_mitra" 
  ON public.lpk_mitra 
  FOR DELETE 
  USING (true);
