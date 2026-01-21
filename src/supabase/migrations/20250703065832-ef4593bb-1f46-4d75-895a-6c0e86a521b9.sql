
-- Fix RLS policies for Settings page functionality
-- First, let's ensure proper RLS policies for user management and role permissions

-- Drop existing conflicting policies to avoid issues
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access to user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin full access to role_permissions" ON public.role_permissions;

-- Create comprehensive RLS policies for profiles table
CREATE POLICY "Admins can manage all profiles" 
  ON public.profiles 
  FOR ALL 
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view and update own profile" 
  ON public.profiles 
  FOR ALL 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create comprehensive RLS policies for user_roles table
CREATE POLICY "Admins can manage all user roles" 
  ON public.user_roles 
  FOR ALL 
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own roles only" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Create comprehensive RLS policies for role_permissions table
CREATE POLICY "Admins can manage all role permissions" 
  ON public.role_permissions 
  FOR ALL 
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "All users can view role permissions" 
  ON public.role_permissions 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Update the get_user_module_permissions function to be more robust
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
  JOIN public.user_roles ur ON ur.role = rp.role
  WHERE ur.user_id = _user_id 
    AND rp.module = _module
  LIMIT 1;
$$;

-- Create a function to get all user permissions for better performance
CREATE OR REPLACE FUNCTION public.get_user_all_permissions(_user_id uuid)
RETURNS TABLE(
  module app_module,
  can_view boolean, 
  can_create boolean, 
  can_update boolean, 
  can_delete boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    rp.module,
    rp.can_view,
    rp.can_create,
    rp.can_update,
    rp.can_delete
  FROM public.role_permissions rp
  JOIN public.user_roles ur ON ur.role = rp.role
  WHERE ur.user_id = _user_id;
$$;

-- Ensure we have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_module ON public.role_permissions(role, module);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_user_module_permissions(uuid, app_module) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_all_permissions(uuid) TO authenticated;
