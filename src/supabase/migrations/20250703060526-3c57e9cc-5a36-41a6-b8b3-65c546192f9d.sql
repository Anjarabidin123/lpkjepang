
-- First, let's ensure the superadmin@lpkujc.com user has the admin role
-- Check if the user exists and add admin role
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the superadmin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'superadmin@lpkujc.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Ensure the user has admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin role assigned to superadmin@lpkujc.com';
    ELSE
        RAISE NOTICE 'User superadmin@lpkujc.com not found in auth.users';
    END IF;
END $$;

-- Also ensure the original admin@lpkujc.com has admin role if it exists
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@lpkujc.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Ensure the user has admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin'::app_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Admin role assigned to admin@lpkujc.com';
    ELSE
        RAISE NOTICE 'User admin@lpkujc.com not found in auth.users';
    END IF;
END $$;

-- Let's also check and fix the RLS policies to ensure they work correctly
-- Update the has_role function to be more robust
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

-- Verify the admin user creation function works correctly
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
