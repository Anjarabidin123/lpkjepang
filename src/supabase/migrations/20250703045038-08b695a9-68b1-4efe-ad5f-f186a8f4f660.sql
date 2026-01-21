
-- Fix RLS policies for administrator role CRUD functionality
-- Drop conflicting policies first
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_policy" ON public.user_roles;

-- Ensure the has_role function is robust
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
    RETURN false;
END;
$$;

-- Clean up and recreate comprehensive RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to view profiles" ON public.profiles;

-- Create comprehensive and non-conflicting RLS policies for profiles
CREATE POLICY "Admin full access to profiles" 
  ON public.profiles 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage own profile" 
  ON public.profiles 
  FOR ALL 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Clean up and recreate comprehensive RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to view user roles" ON public.user_roles;

-- Create comprehensive RLS policies for user_roles
CREATE POLICY "Admin full access to user_roles" 
  ON public.user_roles 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure proper permissions for role_permissions table
DROP POLICY IF EXISTS "Admins can view all role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admins can insert role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admins can update role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admins can delete role permissions" ON public.role_permissions;

CREATE POLICY "Admin full access to role_permissions" 
  ON public.role_permissions 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.user_roles TO authenticated;
GRANT ALL ON public.role_permissions TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Ensure proper function permissions for user management
CREATE OR REPLACE FUNCTION public.get_user_with_roles(_user_id uuid)
RETURNS TABLE(
    id uuid,
    email text,
    full_name text,
    phone text,
    avatar_url text,
    is_active boolean,
    created_at timestamptz,
    updated_at timestamptz,
    roles json
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.full_name,
        p.phone,
        p.avatar_url,
        p.is_active,
        p.created_at,
        p.updated_at,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', ur.id,
                    'role', ur.role,
                    'created_at', ur.created_at
                )
            ) FILTER (WHERE ur.id IS NOT NULL),
            '[]'::json
        ) as roles
    FROM public.profiles p
    LEFT JOIN public.user_roles ur ON ur.user_id = p.id
    WHERE p.id = _user_id
    GROUP BY p.id, p.email, p.full_name, p.phone, p.avatar_url, p.is_active, p.created_at, p.updated_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_with_roles(uuid) TO authenticated;

-- Create helper function for creating users with roles
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
    RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_user_with_role(uuid, text, text, text, app_role, boolean) TO authenticated;
