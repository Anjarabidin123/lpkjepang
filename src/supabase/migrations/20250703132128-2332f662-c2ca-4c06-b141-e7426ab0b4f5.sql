
-- First, let's examine and fix the RLS policies for role_permissions table
-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Admins can create role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admins can manage all role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "All users can view role permissions" ON public.role_permissions;

-- Create comprehensive RLS policies for role_permissions table
-- Allow admins to view all role permissions
CREATE POLICY "Admins can view all role permissions" 
  ON public.role_permissions 
  FOR SELECT 
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to create role permissions
CREATE POLICY "Admins can create role permissions" 
  ON public.role_permissions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update role permissions
CREATE POLICY "Admins can update role permissions" 
  ON public.role_permissions 
  FOR UPDATE 
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete role permissions
CREATE POLICY "Admins can delete role permissions" 
  ON public.role_permissions 
  FOR DELETE 
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow authenticated users to view role permissions for permission checking
CREATE POLICY "Authenticated users can view role permissions" 
  ON public.role_permissions 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Ensure the has_role function is working correctly
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

-- Also ensure the create_role_with_default_permissions function is robust
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

-- Grant necessary permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_role_with_default_permissions(app_role) TO authenticated;
