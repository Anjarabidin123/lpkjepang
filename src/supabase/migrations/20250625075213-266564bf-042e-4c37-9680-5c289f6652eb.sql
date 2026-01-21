
-- Create enum for modules/permissions
CREATE TYPE public.app_module AS ENUM (
  'dashboard',
  'siswa', 
  'kumiai',
  'perusahaan',
  'program',
  'jenis_kerja',
  'posisi_kerja',
  'user_management'
);

-- Create table for role permissions
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  module app_module NOT NULL,
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_update BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, module)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can view all role permissions" 
  ON public.role_permissions 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all role permissions" 
  ON public.role_permissions 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default permissions for admin role
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete) VALUES
('admin', 'dashboard', true, true, true, true),
('admin', 'siswa', true, true, true, true),
('admin', 'kumiai', true, true, true, true),
('admin', 'perusahaan', true, true, true, true),
('admin', 'program', true, true, true, true),
('admin', 'jenis_kerja', true, true, true, true),
('admin', 'posisi_kerja', true, true, true, true),
('admin', 'user_management', true, true, true, true);

-- Insert default permissions for moderator role
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete) VALUES
('moderator', 'dashboard', true, false, false, false),
('moderator', 'siswa', true, true, true, false),
('moderator', 'kumiai', true, true, true, false),
('moderator', 'perusahaan', true, true, true, false),
('moderator', 'program', true, true, true, false),
('moderator', 'jenis_kerja', true, false, false, false),
('moderator', 'posisi_kerja', true, true, true, false),
('moderator', 'user_management', false, false, false, false);

-- Insert default permissions for user role
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete) VALUES
('user', 'dashboard', true, false, false, false),
('user', 'siswa', false, false, false, false),
('user', 'kumiai', false, false, false, false),
('user', 'perusahaan', false, false, false, false),
('user', 'program', false, false, false, false),
('user', 'jenis_kerja', false, false, false, false),
('user', 'posisi_kerja', false, false, false, false),
('user', 'user_management', false, false, false, false);

-- Create function to get user permissions for a module
CREATE OR REPLACE FUNCTION public.get_user_module_permissions(_user_id UUID, _module app_module)
RETURNS TABLE(can_view BOOLEAN, can_create BOOLEAN, can_update BOOLEAN, can_delete BOOLEAN)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT rp.can_view, rp.can_create, rp.can_update, rp.can_delete
  FROM public.role_permissions rp
  JOIN public.user_roles ur ON ur.role = rp.role
  WHERE ur.user_id = _user_id 
    AND rp.module = _module
  LIMIT 1;
$$;

-- Create updated_at trigger for role_permissions
CREATE TRIGGER update_role_permissions_updated_at
  BEFORE UPDATE ON public.role_permissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
