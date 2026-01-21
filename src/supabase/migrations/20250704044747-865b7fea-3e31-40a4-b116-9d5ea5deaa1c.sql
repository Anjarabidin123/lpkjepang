
-- First, let's create a new flexible roles system
-- Create a roles table for flexible role management
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a permissions table for granular permissions
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(role_id, permission_id)
);

-- Create new user_role_assignments table (separate from old user_roles)
CREATE TABLE public.user_role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for roles table
CREATE POLICY "Authenticated users can view roles" ON public.roles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage roles" ON public.roles
    FOR ALL TO authenticated 
    USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for permissions table
CREATE POLICY "Authenticated users can view permissions" ON public.permissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage permissions" ON public.permissions
    FOR ALL TO authenticated 
    USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for role_permissions table
CREATE POLICY "Authenticated users can view role permissions" ON public.role_permissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage role permissions" ON public.role_permissions
    FOR ALL TO authenticated 
    USING (has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for user_role_assignments table
CREATE POLICY "Users can view their own role assignments" ON public.user_role_assignments
    FOR SELECT TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all role assignments" ON public.user_role_assignments
    FOR SELECT TO authenticated 
    USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage role assignments" ON public.user_role_assignments
    FOR ALL TO authenticated 
    USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default system roles
INSERT INTO public.roles (name, display_name, description, is_system_role) VALUES
('super_admin', 'Super Administrator', 'Full system access with all permissions', true),
('admin', 'Administrator', 'Administrative access to most system features', true),
('moderator', 'Moderator', 'Limited administrative access', true),
('user', 'Regular User', 'Standard user access', true),
('rekrutment', 'Recruitment Officer', 'Access to recruitment features', true);

-- Insert default permissions
INSERT INTO public.permissions (name, display_name, description, module, action) VALUES
-- User Management permissions
('user_management.view', 'View Users', 'Can view user list and details', 'user_management', 'view'),
('user_management.create', 'Create Users', 'Can create new users', 'user_management', 'create'),
('user_management.update', 'Update Users', 'Can update user information', 'user_management', 'update'),
('user_management.delete', 'Delete Users', 'Can delete users', 'user_management', 'delete'),
('user_management.assign_roles', 'Assign Roles', 'Can assign roles to users', 'user_management', 'assign_roles'),

-- Role Management permissions
('role_management.view', 'View Roles', 'Can view roles list and details', 'role_management', 'view'),
('role_management.create', 'Create Roles', 'Can create new roles', 'role_management', 'create'),
('role_management.update', 'Update Roles', 'Can update role information', 'role_management', 'update'),
('role_management.delete', 'Delete Roles', 'Can delete roles', 'role_management', 'delete'),
('role_management.assign_permissions', 'Assign Permissions', 'Can assign permissions to roles', 'role_management', 'assign_permissions'),

-- System Management permissions
('system_management.view', 'View System Settings', 'Can view system management area', 'system_management', 'view'),
('system_management.update', 'Update System Settings', 'Can update system settings', 'system_management', 'update');

-- Create helper functions for the new flexible system
CREATE OR REPLACE FUNCTION public.user_has_permission(_user_id UUID, _permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_role_assignments ura
    JOIN public.role_permissions rp ON ura.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ura.user_id = _user_id 
      AND ura.is_active = true
      AND p.name = _permission_name
      AND p.is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS TABLE(permission_name TEXT, display_name TEXT, module TEXT, action TEXT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT DISTINCT p.name, p.display_name, p.module, p.action
  FROM public.user_role_assignments ura
  JOIN public.role_permissions rp ON ura.role_id = rp.role_id
  JOIN public.permissions p ON rp.permission_id = p.id
  WHERE ura.user_id = _user_id 
    AND ura.is_active = true
    AND p.is_active = true
  ORDER BY p.module, p.action;
$$;

-- Create updated_at triggers
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_permissions_updated_at
    BEFORE UPDATE ON public.permissions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Assign all permissions to super_admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'super_admin';

-- Assign basic permissions to admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'admin'
  AND p.name IN (
    'user_management.view', 'user_management.create', 'user_management.update', 'user_management.assign_roles',
    'role_management.view',
    'system_management.view'
  );

-- Assign limited permissions to moderator role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'moderator'
  AND p.name IN (
    'user_management.view', 'user_management.update',
    'system_management.view'
  );
