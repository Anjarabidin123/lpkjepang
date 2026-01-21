
-- Remove the conflicting function signature to resolve the overloading issue
DROP FUNCTION IF EXISTS public.create_role_with_default_permissions(app_role);

-- Ensure we only have the text-based version that can handle any role name
-- This function should already exist from our previous migration, but let's make sure it's correct
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
        -- For custom roles that aren't in the enum, add them dynamically
        BEGIN
            EXECUTE format('ALTER TYPE app_role ADD VALUE %L', _role);
            _role_enum := _role::app_role;
        EXCEPTION WHEN OTHERS THEN
            -- If enum modification fails, this means the value already exists or there's another issue
            -- Try to cast again
            BEGIN
                _role_enum := _role::app_role;
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not handle role: %', _role;
                RETURN false;
            END;
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

-- Also ensure the delete function only has one signature
DROP FUNCTION IF EXISTS public.delete_role_and_permissions(app_role);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_role_with_default_permissions(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_role_and_permissions(text) TO authenticated;
