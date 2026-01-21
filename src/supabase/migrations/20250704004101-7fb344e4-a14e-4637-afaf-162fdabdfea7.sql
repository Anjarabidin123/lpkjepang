
-- Fix RLS policies for role_permissions to allow role creation function to work
-- The issue is that the create_role_with_default_permissions function needs to insert 
-- default permissions but the current RLS policy is too restrictive

-- Drop the restrictive policy that's blocking role creation
DROP POLICY IF EXISTS "Admins can create role permissions" ON public.role_permissions;

-- Create a more permissive policy that allows the SECURITY DEFINER function to work
-- while still maintaining security for direct user operations
CREATE POLICY "Allow role creation and admin management" 
  ON public.role_permissions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    -- Allow if user is admin (for direct operations)
    has_role(auth.uid(), 'admin'::app_role) 
    OR 
    -- Allow if this is being called from a SECURITY DEFINER function
    -- (which is the case for create_role_with_default_permissions)
    current_setting('role') = 'postgres'
  );

-- Also ensure the update policy works correctly for admin operations
DROP POLICY IF EXISTS "Admins can update role permissions" ON public.role_permissions;
CREATE POLICY "Admins can update role permissions" 
  ON public.role_permissions 
  FOR UPDATE 
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Ensure the delete policy works correctly for admin operations
DROP POLICY IF EXISTS "Admins can delete role permissions" ON public.role_permissions;
CREATE POLICY "Admins can delete role permissions" 
  ON public.role_permissions 
  FOR DELETE 
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
