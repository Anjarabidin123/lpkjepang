
-- Fix RLS policies with proper conflict handling
-- First, let's verify and fix the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id 
      AND ur.role = _role
  )
$$;

-- Update policies for siswa table to ensure proper access
DROP POLICY IF EXISTS "Admins can manage all siswa" ON public.siswa;
DROP POLICY IF EXISTS "Moderators can view and update siswa" ON public.siswa;
DROP POLICY IF EXISTS "Moderators can create siswa" ON public.siswa;
DROP POLICY IF EXISTS "Moderators can update siswa" ON public.siswa;
DROP POLICY IF EXISTS "Users can view siswa" ON public.siswa;
DROP POLICY IF EXISTS "Admin full access to siswa" ON public.siswa;
DROP POLICY IF EXISTS "Moderator read write access to siswa" ON public.siswa;
DROP POLICY IF EXISTS "Moderator can insert siswa" ON public.siswa;
DROP POLICY IF EXISTS "Moderator can update siswa" ON public.siswa;
DROP POLICY IF EXISTS "User can view siswa" ON public.siswa;

-- Enable RLS on siswa table if not already enabled
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for siswa table
CREATE POLICY "Admin full access to siswa" 
  ON public.siswa 
  FOR ALL 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderator read access to siswa" 
  ON public.siswa 
  FOR SELECT 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Moderator can insert siswa" 
  ON public.siswa 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Moderator can update siswa" 
  ON public.siswa 
  FOR UPDATE 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "User can view siswa" 
  ON public.siswa 
  FOR SELECT 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'user'));

-- Update policies for siswa_magang table
DROP POLICY IF EXISTS "Admins can manage all siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Moderators can view and update siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Moderators can create siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Moderators can update siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Users can view siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Admin full access to siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Moderator read access to siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Moderator can insert siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "Moderator can update siswa_magang" ON public.siswa_magang;
DROP POLICY IF EXISTS "User can view siswa_magang" ON public.siswa_magang;

-- Enable RLS on siswa_magang table if not already enabled
ALTER TABLE public.siswa_magang ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access to siswa_magang" 
  ON public.siswa_magang 
  FOR ALL 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderator read access to siswa_magang" 
  ON public.siswa_magang 
  FOR SELECT 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Moderator can insert siswa_magang" 
  ON public.siswa_magang 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Moderator can update siswa_magang" 
  ON public.siswa_magang 
  FOR UPDATE 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "User can view siswa_magang" 
  ON public.siswa_magang 
  FOR SELECT 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'user'));

-- Fix related tables policies with proper DROP handling
ALTER TABLE public.siswa_pengalaman_kerja ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage siswa_pengalaman_kerja" ON public.siswa_pengalaman_kerja;
DROP POLICY IF EXISTS "Moderators can manage siswa_pengalaman_kerja" ON public.siswa_pengalaman_kerja;
DROP POLICY IF EXISTS "Admin full access to siswa_pengalaman_kerja" ON public.siswa_pengalaman_kerja;
DROP POLICY IF EXISTS "Moderator full access to siswa_pengalaman_kerja" ON public.siswa_pengalaman_kerja;
CREATE POLICY "Admin full access to siswa_pengalaman_kerja" ON public.siswa_pengalaman_kerja FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderator full access to siswa_pengalaman_kerja" ON public.siswa_pengalaman_kerja FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'moderator'));

ALTER TABLE public.siswa_kontak_keluarga ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage siswa_kontak_keluarga" ON public.siswa_kontak_keluarga;
DROP POLICY IF EXISTS "Moderators can manage siswa_kontak_keluarga" ON public.siswa_kontak_keluarga;
DROP POLICY IF EXISTS "Admin full access to siswa_kontak_keluarga" ON public.siswa_kontak_keluarga;
DROP POLICY IF EXISTS "Moderator full access to siswa_kontak_keluarga" ON public.siswa_kontak_keluarga;
CREATE POLICY "Admin full access to siswa_kontak_keluarga" ON public.siswa_kontak_keluarga FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderator full access to siswa_kontak_keluarga" ON public.siswa_kontak_keluarga FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'moderator'));

ALTER TABLE public.siswa_keluarga_indonesia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage siswa_keluarga_indonesia" ON public.siswa_keluarga_indonesia;
DROP POLICY IF EXISTS "Moderators can manage siswa_keluarga_indonesia" ON public.siswa_keluarga_indonesia;
DROP POLICY IF EXISTS "Admin full access to siswa_keluarga_indonesia" ON public.siswa_keluarga_indonesia;
DROP POLICY IF EXISTS "Moderator full access to siswa_keluarga_indonesia" ON public.siswa_keluarga_indonesia;
CREATE POLICY "Admin full access to siswa_keluarga_indonesia" ON public.siswa_keluarga_indonesia FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderator full access to siswa_keluarga_indonesia" ON public.siswa_keluarga_indonesia FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'moderator'));

ALTER TABLE public.siswa_keluarga_jepang ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage siswa_keluarga_jepang" ON public.siswa_keluarga_jepang;
DROP POLICY IF EXISTS "Moderators can manage siswa_keluarga_jepang" ON public.siswa_keluarga_jepang;
DROP POLICY IF EXISTS "Admin full access to siswa_keluarga_jepang" ON public.siswa_keluarga_jepang;
DROP POLICY IF EXISTS "Moderator full access to siswa_keluarga_jepang" ON public.siswa_keluarga_jepang;
CREATE POLICY "Admin full access to siswa_keluarga_jepang" ON public.siswa_keluarga_jepang FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderator full access to siswa_keluarga_jepang" ON public.siswa_keluarga_jepang FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'moderator'));

ALTER TABLE public.siswa_pendidikan ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage siswa_pendidikan" ON public.siswa_pendidikan;
DROP POLICY IF EXISTS "Moderators can manage siswa_pendidikan" ON public.siswa_pendidikan;
DROP POLICY IF EXISTS "Admin full access to siswa_pendidikan" ON public.siswa_pendidikan;
DROP POLICY IF EXISTS "Moderator full access to siswa_pendidikan" ON public.siswa_pendidikan;
CREATE POLICY "Admin full access to siswa_pendidikan" ON public.siswa_pendidikan FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Moderator full access to siswa_pendidikan" ON public.siswa_pendidikan FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'moderator'));

-- Grant necessary permissions on user_roles table  
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Grant necessary permissions on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Make sure the admin user has the correct role assigned
-- First, get the admin user ID and ensure role is assigned
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_id 
    FROM auth.users 
    WHERE email = 'admin@lpkujc.com';
    
    IF admin_id IS NOT NULL THEN
        -- Ensure the user has admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- Ensure profile exists
        INSERT INTO public.profiles (id, full_name, email, is_active)
        VALUES (admin_id, 'Administrator', 'admin@lpkujc.com', true)
        ON CONFLICT (id) DO UPDATE SET
            full_name = 'Administrator',
            email = 'admin@lpkujc.com',
            is_active = true;
    END IF;
END $$;
