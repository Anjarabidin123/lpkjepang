
-- Fix RLS policies to ensure admin users can create users and manage roles properly
-- First, ensure the has_role function works correctly with all roles including 'rekrutment'
DROP TYPE IF EXISTS app_role CASCADE;
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user', 'rekrutment');

-- Recreate the has_role function with better error handling
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
    -- Handle null user_id case
    IF _user_id IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = _user_id 
          AND ur.role = _role
    );
EXCEPTION WHEN OTHERS THEN
    -- Log error and return false for safety
    RAISE NOTICE 'Error in has_role function: %', SQLERRM;
    RETURN false;
END;
$$;

-- Update user_roles table to use the new enum
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE public.user_roles ALTER COLUMN role TYPE app_role USING role::app_role;

-- Update role_permissions table to use the new enum  
ALTER TABLE public.role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_check;
ALTER TABLE public.role_permissions ALTER COLUMN role TYPE app_role USING role::app_role;

-- Ensure admin user exists and has proper role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'admin@lpkujc.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Add missing permissions for rekrutment role
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete) VALUES
('rekrutment', 'dashboard', true, false, false, false),
('rekrutment', 'siswa', true, true, true, false),
('rekrutment', 'kumiai', true, false, false, false),
('rekrutment', 'perusahaan', true, false, false, false),
('rekrutment', 'program', true, false, false, false),
('rekrutment', 'jenis_kerja', true, false, false, false),
('rekrutment', 'posisi_kerja', true, false, false, false),
('rekrutment', 'user_management', false, false, false, false),
('rekrutment', 'lpk_mitra', true, false, true, false)
ON CONFLICT (role, module) DO NOTHING;

-- Grant necessary permissions to service role for admin operations
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON auth.users TO service_role;

-- Create a more robust create_user_with_role function
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
    -- Insert profile
    INSERT INTO public.profiles (id, email, full_name, phone, is_active)
    VALUES (_user_id, _email, _full_name, _phone, _is_active)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        is_active = EXCLUDED.is_active,
        updated_at = now();
    
    -- Insert role if provided
    IF _role IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (_user_id, _role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in create_user_with_role: %', SQLERRM;
    RETURN false;
END;
$$;

-- Update create_role_with_default_permissions function
CREATE OR REPLACE FUNCTION public.create_role_with_default_permissions(_role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _module app_module;
BEGIN
    -- Insert default permissions for all modules for the new role
    FOR _module IN SELECT unnest(enum_range(NULL::app_module))
    LOOP
        INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete)
        VALUES (_role, _module, false, false, false, false)
        ON CONFLICT (role, module) DO NOTHING;
    END LOOP;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in create_role_with_default_permissions: %', SQLERRM;
    RETURN false;
END;
$$;
