
-- Drop all RLS policies for role_permissions table
DROP POLICY IF EXISTS "Admins can delete role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admins can update role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admins can view all role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Allow role creation and admin management" ON public.role_permissions;
DROP POLICY IF EXISTS "Authenticated users can view role permissions" ON public.role_permissions;

-- Drop functions that depend on role_permissions
DROP FUNCTION IF EXISTS public.get_user_module_permissions(uuid, app_module);
DROP FUNCTION IF EXISTS public.get_user_all_permissions(uuid);
DROP FUNCTION IF EXISTS public.create_role_with_default_permissions(text);
DROP FUNCTION IF EXISTS public.delete_role_and_permissions(text);

-- Drop triggers if any exist
DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON public.role_permissions;

-- Drop the role_permissions table completely
DROP TABLE IF EXISTS public.role_permissions CASCADE;

-- Drop the app_module enum if no other tables use it
DROP TYPE IF EXISTS public.app_module CASCADE;

-- Optionally drop app_role enum if you want to remove role system entirely
-- DROP TYPE IF EXISTS public.app_role CASCADE;

-- Clean up any remaining references
-- Note: This will also remove user_roles table if you want complete cleanup
-- DROP TABLE IF EXISTS public.user_roles CASCADE;
