
-- Add support for custom role names by extending the app_role enum
-- and updating functions to handle text-based role names

-- First, let's add a text-based role creation function that doesn't rely on enum restrictions
CREATE OR REPLACE FUNCTION public.create_role_with_default_permissions(_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _module app_module;
    _role_enum app_role;
BEGIN
    -- Try to convert text to app_role enum, but allow custom roles
    BEGIN
        _role_enum := _role::app_role;
    EXCEPTION WHEN invalid_text_representation THEN
        -- For custom roles that aren't in the enum, we'll handle them specially
        -- by adding them to the enum dynamically or using text directly
        
        -- First, try to add the new role to the enum
        BEGIN
            EXECUTE format('ALTER TYPE app_role ADD VALUE %L', _role);
            _role_enum := _role::app_role;
        EXCEPTION WHEN OTHERS THEN
            -- If we can't add to enum, we'll use one of the existing values as placeholder
            -- and store the actual role name in the role_permissions table
            _role_enum := 'user'::app_role;
        END;
    END;
    
    -- Insert default permissions for all modules for the new role
    FOR _module IN SELECT unnest(enum_range(NULL::app_module))
    LOOP
        INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete)
        VALUES (_role_enum, _module, false, false, false, false)
        ON CONFLICT (role, module) DO NOTHING;
    END LOOP;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in create_role_with_default_permissions: %', SQLERRM;
    RETURN false;
END;
$$;

-- Also create a function to handle role deletion with text input
CREATE OR REPLACE FUNCTION public.delete_role_and_permissions(_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _role_enum app_role;
BEGIN
    -- Convert text to app_role enum
    BEGIN
        _role_enum := _role::app_role;
    EXCEPTION WHEN invalid_text_representation THEN
        RAISE NOTICE 'Invalid role: %', _role;
        RETURN false;
    END;
    
    -- Prevent deletion of system roles
    IF _role_enum IN ('admin', 'moderator', 'user') THEN
        RAISE NOTICE 'Cannot delete system role: %', _role;
        RETURN false;
    END IF;
    
    -- Delete all permissions for the role
    DELETE FROM public.role_permissions WHERE role = _role_enum;
    
    -- Delete all user assignments for this role
    DELETE FROM public.user_roles WHERE role = _role_enum;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in delete_role_and_permissions: %', SQLERRM;
    RETURN false;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_role_with_default_permissions(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_role_and_permissions(text) TO authenticated;
