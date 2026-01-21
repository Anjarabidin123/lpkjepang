
-- Step 1: Update the app_role enum to allow for flexible role naming
-- We'll keep the core system roles but allow for custom roles
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'custom';

-- Step 2: Add a new column to store flexible role names
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS custom_role_name TEXT;

-- Step 3: Add a new column to role_permissions for flexible role names
ALTER TABLE public.role_permissions ADD COLUMN IF NOT EXISTS custom_role_name TEXT;

-- Step 4: Update the has_role function to support both enum and custom roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
    -- Handle null user_id case
    IF _user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if it's a system role (admin, moderator, user, rekrutment)
    IF _role IN ('admin', 'moderator', 'user', 'rekrutment') THEN
        RETURN EXISTS (
            SELECT 1
            FROM public.user_roles ur
            WHERE ur.user_id = _user_id 
              AND ur.role = _role::app_role
        );
    ELSE
        -- Check custom roles
        RETURN EXISTS (
            SELECT 1
            FROM public.user_roles ur
            WHERE ur.user_id = _user_id 
              AND ur.role = 'custom'::app_role
              AND ur.custom_role_name = _role
        );
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in has_role function: %', SQLERRM;
    RETURN false;
END;
$$;

-- Step 5: Update create_role_with_default_permissions to support flexible naming
CREATE OR REPLACE FUNCTION public.create_role_with_default_permissions(_role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _module app_module;
    _role_enum app_role;
    _custom_name text;
BEGIN
    -- Determine if it's a system role or custom role
    IF _role_name IN ('admin', 'moderator', 'user', 'rekrutment') THEN
        _role_enum := _role_name::app_role;
        _custom_name := NULL;
    ELSE
        _role_enum := 'custom'::app_role;
        _custom_name := _role_name;
    END IF;
    
    -- Insert default permissions for all modules for the new role
    FOR _module IN SELECT unnest(enum_range(NULL::app_module))
    LOOP
        INSERT INTO public.role_permissions (role, module, custom_role_name, can_view, can_create, can_update, can_delete)
        VALUES (_role_enum, _module, _custom_name, false, false, false, false)
        ON CONFLICT (role, module, COALESCE(custom_role_name, '')) DO NOTHING;
    END LOOP;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in create_role_with_default_permissions: %', SQLERRM;
    RETURN false;
END;
$$;

-- Step 6: Update delete_role_and_permissions for flexible roles
CREATE OR REPLACE FUNCTION public.delete_role_and_permissions(_role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Prevent deletion of admin role
    IF _role_name = 'admin' THEN
        RAISE NOTICE 'Cannot delete admin role: %', _role_name;
        RETURN false;
    END IF;
    
    -- Delete permissions and user assignments
    IF _role_name IN ('admin', 'moderator', 'user', 'rekrutment') THEN
        -- System role
        DELETE FROM public.role_permissions WHERE role = _role_name::app_role;
        DELETE FROM public.user_roles WHERE role = _role_name::app_role;
    ELSE
        -- Custom role
        DELETE FROM public.role_permissions WHERE role = 'custom'::app_role AND custom_role_name = _role_name;
        DELETE FROM public.user_roles WHERE role = 'custom'::app_role AND custom_role_name = _role_name;
    END IF;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in delete_role_and_permissions: %', SQLERRM;
    RETURN false;
END;
$$;

-- Step 7: Add unique constraint for custom roles
ALTER TABLE public.role_permissions 
DROP CONSTRAINT IF EXISTS role_permissions_role_module_key;

ALTER TABLE public.role_permissions 
ADD CONSTRAINT role_permissions_unique 
UNIQUE (role, module, COALESCE(custom_role_name, ''));

ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_unique;

ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_unique 
UNIQUE (user_id, role, COALESCE(custom_role_name, ''));

-- Step 8: Update get_user_module_permissions function
CREATE OR REPLACE FUNCTION public.get_user_module_permissions(_user_id uuid, _module app_module)
RETURNS TABLE(can_view boolean, can_create boolean, can_update boolean, can_delete boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(rp.can_view, false) as can_view,
    COALESCE(rp.can_create, false) as can_create,
    COALESCE(rp.can_update, false) as can_update,
    COALESCE(rp.can_delete, false) as can_delete
  FROM public.role_permissions rp
  JOIN public.user_roles ur ON (
    ur.role = rp.role 
    AND COALESCE(ur.custom_role_name, '') = COALESCE(rp.custom_role_name, '')
  )
  WHERE ur.user_id = _user_id 
    AND rp.module = _module
  LIMIT 1;
$$;

-- Step 9: Update create_user_with_role function
CREATE OR REPLACE FUNCTION public.create_user_with_role(
    _user_id uuid,
    _email text,
    _full_name text,
    _phone text,
    _role_name text,
    _is_active boolean DEFAULT true
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _role_enum app_role;
    _custom_name text;
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
    
    -- Remove any existing roles for this user
    DELETE FROM public.user_roles WHERE user_id = _user_id;
    
    -- Insert the new role
    IF _role_name IS NOT NULL THEN
        IF _role_name IN ('admin', 'moderator', 'user', 'rekrutment') THEN
            _role_enum := _role_name::app_role;
            _custom_name := NULL;
        ELSE
            _role_enum := 'custom'::app_role;
            _custom_name := _role_name;
        END IF;
        
        INSERT INTO public.user_roles (user_id, role, custom_role_name)
        VALUES (_user_id, _role_enum, _custom_name);
    END IF;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in create_user_with_role: %', SQLERRM;
    RETURN false;
END;
$$;
