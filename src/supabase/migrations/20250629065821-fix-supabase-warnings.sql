
-- Fix Supabase warnings and improve RLS policies

-- 1. Enable RLS on siswa table if not already enabled
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;

-- 2. Fix siswa_magang table RLS policies to match siswa table structure
ALTER TABLE public.siswa_magang ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for siswa_magang
DROP POLICY IF EXISTS "Allow authenticated users to view siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Allow authenticated users to insert siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Allow authenticated users to update siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Allow authenticated users to delete siswa_magang" ON public.siswa_magang;

-- Create proper role-based policies for siswa_magang
CREATE POLICY "Admin full access to siswa_magang" 
  ON public.siswa_magang 
  FOR ALL 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderator full access to siswa_magang" 
  ON public.siswa_magang 
  FOR ALL 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "User can view siswa_magang" 
  ON public.siswa_magang 
  FOR SELECT 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'user') OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "User can create siswa_magang" 
  ON public.siswa_magang 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'user') OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "User can update siswa_magang" 
  ON public.siswa_magang 
  FOR UPDATE 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'user') OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- 3. Add proper RLS policies for remaining tables that might need them
ALTER TABLE public.kumiai ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can access kumiai" ON public.kumiai;
CREATE POLICY "Authenticated users can access kumiai" ON public.kumiai FOR ALL TO authenticated USING (true);

ALTER TABLE public.perusahaan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can access perusahaan" ON public.perusahaan;
CREATE POLICY "Authenticated users can access perusahaan" ON public.perusahaan FOR ALL TO authenticated USING (true);

ALTER TABLE public.program ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can access program" ON public.program;
CREATE POLICY "Authenticated users can access program" ON public.program FOR ALL TO authenticated USING (true);

ALTER TABLE public.jenis_kerja ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can access jenis_kerja" ON public.jenis_kerja;
CREATE POLICY "Authenticated users can access jenis_kerja" ON public.jenis_kerja FOR ALL TO authenticated USING (true);

ALTER TABLE public.posisi_kerja ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "All users can access posisi_kerja" ON public.posisi_kerja;
CREATE POLICY "Authenticated users can access posisi_kerja" ON public.posisi_kerja FOR ALL TO authenticated USING (true);

-- 4. Fix job_orders and job_order_peserta RLS policies
ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view job_orders" ON public.job_orders;
DROP POLICY IF EXISTS "Users can insert job_orders" ON public.job_orders;
DROP POLICY IF EXISTS "Users can update job_orders" ON public.job_orders;
DROP POLICY IF EXISTS "Users can delete job_orders" ON public.job_orders;
CREATE POLICY "Authenticated users can access job_orders" ON public.job_orders FOR ALL TO authenticated USING (true);

ALTER TABLE public.job_order_peserta ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view job order peserta" ON public.job_order_peserta;
DROP POLICY IF EXISTS "Users can insert job order peserta" ON public.job_order_peserta;
DROP POLICY IF EXISTS "Users can update job order peserta" ON public.job_order_peserta;
DROP POLICY IF EXISTS "Users can delete job order peserta" ON public.job_order_peserta;
CREATE POLICY "Authenticated users can access job_order_peserta" ON public.job_order_peserta FOR ALL TO authenticated USING (true);

-- 5. Ensure all tables have proper updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers where missing
DROP TRIGGER IF EXISTS handle_updated_at ON public.siswa;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.siswa
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.kumiai;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.kumiai
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.perusahaan;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.perusahaan
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 6. Grant necessary permissions to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
