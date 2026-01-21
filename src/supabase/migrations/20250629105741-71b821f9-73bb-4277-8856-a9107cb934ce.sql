
-- Add function to create new role with default permissions
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
    RETURN false;
END;
$$;

-- Add function to delete role and its permissions
CREATE OR REPLACE FUNCTION public.delete_role_and_permissions(_role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete all permissions for the role
    DELETE FROM public.role_permissions WHERE role = _role;
    
    -- Delete all user assignments for this role
    DELETE FROM public.user_roles WHERE role = _role;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Add unique constraint on role_permissions to prevent duplicates
ALTER TABLE public.role_permissions ADD CONSTRAINT unique_role_module UNIQUE (role, module);

-- Grant execute permissions on new functions
GRANT EXECUTE ON FUNCTION public.create_role_with_default_permissions(app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_role_and_permissions(app_role) TO authenticated;
