
-- Fix RLS policies for user management Create operations
-- The issue is likely that Create operations need proper WITH CHECK clauses

-- First, let's ensure the profiles table has proper policies for creating users
DROP POLICY IF EXISTS "Admins can create profiles for new users" ON public.profiles;
CREATE POLICY "Admins can create profiles for new users" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Ensure user_roles table allows admins to assign roles during user creation
DROP POLICY IF EXISTS "Admins can assign roles to users" ON public.user_roles;
CREATE POLICY "Admins can assign roles to users" 
  ON public.user_roles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix the create_user_with_role function to handle role assignment properly
CREATE OR REPLACE FUNCTION public.create_user_with_role(
    _user_id uuid,
    _email text,
    _full_name text,
    _phone text,
    _role app_role,
    _is_active boolean DEFAULT true
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert profile first
    INSERT INTO public.profiles (id, email, full_name, phone, is_active)
    VALUES (_user_id, _email, _full_name, _phone, _is_active)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        is_active = EXCLUDED.is_active,
        updated_at = now();
    
    -- Remove any existing roles for this user (ensure single role per user)
    DELETE FROM public.user_roles WHERE user_id = _user_id;
    
    -- Insert the new role
    IF _role IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (_user_id, _role);
    END IF;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in create_user_with_role: %', SQLERRM;
    RETURN false;
END;
$$;

-- Grant necessary permissions to authenticated users for the function
GRANT EXECUTE ON FUNCTION public.create_user_with_role(uuid, text, text, text, app_role, boolean) TO authenticated;

-- Ensure proper permissions for role_permissions table operations
DROP POLICY IF EXISTS "Admins can create role permissions" ON public.role_permissions;
CREATE POLICY "Admins can create role permissions" 
  ON public.role_permissions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Also ensure the service role can create users in auth.users table
-- This is handled by the edge function or server-side code, not RLS
