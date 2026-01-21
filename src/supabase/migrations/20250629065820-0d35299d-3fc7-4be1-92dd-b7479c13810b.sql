
-- Fix RLS policies for siswa table to allow users with 'user' role to create siswa
-- First, let's check and update the existing policies

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin full access to siswa" ON public.siswa;
DROP POLICY IF EXISTS "Moderator read access to siswa" ON public.siswa;
DROP POLICY IF EXISTS "Moderator can insert siswa" ON public.siswa;
DROP POLICY IF EXISTS "Moderator can update siswa" ON public.siswa;
DROP POLICY IF EXISTS "User can view siswa" ON public.siswa;

-- Create new comprehensive policies that allow proper access
CREATE POLICY "Admin full access to siswa" 
  ON public.siswa 
  FOR ALL 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderator full access to siswa" 
  ON public.siswa 
  FOR ALL 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "User can view siswa" 
  ON public.siswa 
  FOR SELECT 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'user') OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "User can create siswa" 
  ON public.siswa 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'user') OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "User can update siswa" 
  ON public.siswa 
  FOR UPDATE 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'user') OR public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- Also ensure the admin user has proper role assignment
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_id 
    FROM auth.users 
    WHERE email = 'superadmin@lpkujc.com';
    
    IF admin_id IS NOT NULL THEN
        -- Ensure the user has admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- Also add user role as fallback
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_id, 'user'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;

-- Update related table policies to be consistent
ALTER TABLE public.siswa_pengalaman_kerja ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access to siswa_pengalaman_kerja" ON public.siswa_pengalaman_kerja;
DROP POLICY IF EXISTS "Moderator full access to siswa_pengalaman_kerja" ON public.siswa_pengalaman_kerja;
CREATE POLICY "All authenticated users can manage siswa_pengalaman_kerja" ON public.siswa_pengalaman_kerja FOR ALL TO authenticated USING (true);

ALTER TABLE public.siswa_kontak_keluarga ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access to siswa_kontak_keluarga" ON public.siswa_kontak_keluarga;
DROP POLICY IF EXISTS "Moderator full access to siswa_kontak_keluarga" ON public.siswa_kontak_keluarga;
CREATE POLICY "All authenticated users can manage siswa_kontak_keluarga" ON public.siswa_kontak_keluarga FOR ALL TO authenticated USING (true);

ALTER TABLE public.siswa_keluarga_indonesia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access to siswa_keluarga_indonesia" ON public.siswa_keluarga_indonesia;
DROP POLICY IF EXISTS "Moderator full access to siswa_keluarga_indonesia" ON public.siswa_keluarga_indonesia;
CREATE POLICY "All authenticated users can manage siswa_keluarga_indonesia" ON public.siswa_keluarga_indonesia FOR ALL TO authenticated USING (true);

ALTER TABLE public.siswa_keluarga_jepang ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access to siswa_keluarga_jepang" ON public.siswa_keluarga_jepang;
DROP POLICY IF EXISTS "Moderator full access to siswa_keluarga_jepang" ON public.siswa_keluarga_jepang;
CREATE POLICY "All authenticated users can manage siswa_keluarga_jepang" ON public.siswa_keluarga_jepang FOR ALL TO authenticated USING (true);

ALTER TABLE public.siswa_pendidikan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin full access to siswa_pendidikan" ON public.siswa_pendidikan;
DROP POLICY IF EXISTS "Moderator full access to siswa_pendidikan" ON public.siswa_pendidikan;
CREATE POLICY "All authenticated users can manage siswa_pendidikan" ON public.siswa_pendidikan FOR ALL TO authenticated USING (true);
