
-- First, let's ensure the superadmin user exists with correct password
-- Delete any existing problematic entries
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'superadmin@lpkujc.com'
);

-- Update the existing superadmin user with correct password hash
UPDATE auth.users 
SET 
  encrypted_password = crypt('1234qwer', gen_salt('bf')),
  email_confirmed_at = NOW(),
  raw_user_meta_data = '{"full_name": "Super Admin"}',
  updated_at = NOW()
WHERE email = 'superadmin@lpkujc.com';

-- Ensure profile exists for the superadmin user
INSERT INTO public.profiles (
  id,
  full_name,
  email,
  is_active,
  created_at,
  updated_at
)
SELECT 
  id,
  'Super Admin',
  'superadmin@lpkujc.com',
  true,
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'superadmin@lpkujc.com'
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Super Admin',
  email = 'superadmin@lpkujc.com',
  is_active = true,
  updated_at = NOW();

-- Ensure admin role exists for the superadmin user
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
  id,
  'admin'::app_role,
  NOW()
FROM auth.users 
WHERE email = 'superadmin@lpkujc.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Also ensure basic user role exists as fallback
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
  id,
  'user'::app_role,
  NOW()
FROM auth.users 
WHERE email = 'superadmin@lpkujc.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify RLS policies are working correctly
-- Create more permissive policies for testing if needed
DROP POLICY IF EXISTS "Allow authenticated users to view profiles" ON public.profiles;
CREATE POLICY "Allow authenticated users to view profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to view user roles" ON public.user_roles;
CREATE POLICY "Allow authenticated users to view user roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (true);
