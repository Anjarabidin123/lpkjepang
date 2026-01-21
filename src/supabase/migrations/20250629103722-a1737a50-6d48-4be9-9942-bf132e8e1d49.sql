
-- Fixed approach: Work with existing admin user instead of creating new one
DO $$
DECLARE
    existing_admin_id UUID;
    target_admin_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- Find existing admin user by email
    SELECT id INTO existing_admin_id 
    FROM auth.users 
    WHERE email = 'superadmin@lpkujc.com' 
    LIMIT 1;
    
    IF existing_admin_id IS NOT NULL THEN
        RAISE NOTICE 'Found existing admin user with ID: %', existing_admin_id;
        
        -- Clean up any existing roles for this user
        DELETE FROM public.user_roles WHERE user_id = existing_admin_id;
        
        -- Update password for existing user
        UPDATE auth.users 
        SET encrypted_password = crypt('1234qwer', gen_salt('bf')),
            email_confirmed_at = NOW(),
            raw_user_meta_data = '{"full_name": "Super Admin"}',
            updated_at = NOW()
        WHERE id = existing_admin_id;
        
        -- Create/update profile for existing user
        INSERT INTO public.profiles (
            id,
            full_name,
            email,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            existing_admin_id,
            'Super Admin',
            'superadmin@lpkujc.com',
            true,
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
            full_name = 'Super Admin',
            email = 'superadmin@lpkujc.com',
            is_active = true,
            updated_at = NOW();
        
        -- Assign admin role to existing user
        INSERT INTO public.user_roles (
            user_id,
            role,
            created_at
        ) VALUES (
            existing_admin_id,
            'admin',
            NOW()
        );
        
        RAISE NOTICE 'Updated existing admin user: %', existing_admin_id;
    ELSE
        RAISE EXCEPTION 'No existing admin user found with email superadmin@lpkujc.com';
    END IF;
END $$;

-- Create simple permissive policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_policy" ON public.user_roles;

CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "user_roles_select_policy" ON public.user_roles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "user_roles_insert_policy" ON public.user_roles
    FOR INSERT TO authenticated WITH CHECK (true);

-- Ensure helper function exists
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = _user_id 
          AND ur.role = _role
    );
EXCEPTION WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
