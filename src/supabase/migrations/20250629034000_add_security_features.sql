
-- Create security_events table for logging
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security_events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Create policy for security events (only admins can view)
CREATE POLICY "Admins can view security events" 
  ON public.security_events 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create policy for inserting security events (authenticated users can log events)
CREATE POLICY "Authenticated users can log security events" 
  ON public.security_events 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Insert role permissions data (delete existing first to avoid conflicts)
DELETE FROM public.role_permissions;

INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete) VALUES
('admin', 'dashboard', true, true, true, true),
('admin', 'siswa', true, true, true, true),
('admin', 'kumiai', true, true, true, true),
('admin', 'perusahaan', true, true, true, true),
('admin', 'program', true, true, true, true),
('admin', 'jenis_kerja', true, true, true, true),
('admin', 'posisi_kerja', true, true, true, true),
('admin', 'user_management', true, true, true, true),
('moderator', 'dashboard', true, false, false, false),
('moderator', 'siswa', true, true, true, false),
('moderator', 'kumiai', true, false, true, false),
('moderator', 'perusahaan', true, false, true, false),
('moderator', 'program', true, false, true, false),
('moderator', 'jenis_kerja', true, false, true, false),
('moderator', 'posisi_kerja', true, false, true, false),
('moderator', 'user_management', true, false, false, false),
('user', 'dashboard', true, false, false, false),
('user', 'siswa', true, false, false, false),
('user', 'kumiai', true, false, false, false),
('user', 'perusahaan', true, false, false, false),
('user', 'program', true, false, false, false),
('user', 'jenis_kerja', true, false, false, false),
('user', 'posisi_kerja', true, false, false, false),
('user', 'user_management', false, false, false, false);
