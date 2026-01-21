
-- Remove duplicate roles and ensure users have only one primary role
-- First, let's clean up any users who have multiple roles
DELETE FROM public.user_roles 
WHERE user_id IN (
    SELECT user_id 
    FROM public.user_roles 
    GROUP BY user_id 
    HAVING COUNT(*) > 1
) AND role != 'admin';

-- Ensure superadmin@lpkujc.com only has admin role
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the superadmin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'superadmin@lpkujc.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Remove all existing roles for this user
        DELETE FROM public.user_roles WHERE user_id = admin_user_id;
        
        -- Add only admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin'::app_role);
        
        RAISE NOTICE 'Cleaned up roles for superadmin@lpkujc.com - now only has admin role';
    END IF;
END $$;

-- Also clean up admin@lpkujc.com if it exists
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@lpkujc.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Remove all existing roles for this user
        DELETE FROM public.user_roles WHERE user_id = admin_user_id;
        
        -- Add only admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin'::app_role);
        
        RAISE NOTICE 'Cleaned up roles for admin@lpkujc.com - now only has admin role';
    END IF;
END $$;

-- Update the unique constraint to prevent multiple roles per user
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Create a trigger to prevent multiple role assignments
CREATE OR REPLACE FUNCTION prevent_multiple_roles()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user already has a role
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) THEN
        RAISE EXCEPTION 'User can only have one role. Please update the existing role instead of adding a new one.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_multiple_roles_trigger ON public.user_roles;
CREATE TRIGGER prevent_multiple_roles_trigger
    BEFORE INSERT OR UPDATE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION prevent_multiple_roles();
