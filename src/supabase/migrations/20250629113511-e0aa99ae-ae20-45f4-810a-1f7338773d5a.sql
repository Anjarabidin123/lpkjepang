
-- Create LPK Mitra table
CREATE TABLE public.lpk_mitra (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kode text NOT NULL UNIQUE,
  nama_lpk text NOT NULL,
  pic_nama text,
  email text,
  phone text,
  alamat text,
  status status_umum DEFAULT 'Aktif'::status_umum,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add LPK Mitra reference to siswa table
ALTER TABLE public.siswa ADD COLUMN lpk_mitra_id uuid REFERENCES public.lpk_mitra(id);

-- Add LPK Mitra reference to siswa_magang table
ALTER TABLE public.siswa_magang ADD COLUMN lpk_mitra_id uuid REFERENCES public.lpk_mitra(id);

-- Create trigger for updated_at on lpk_mitra
CREATE TRIGGER update_lpk_mitra_updated_at
  BEFORE UPDATE ON public.lpk_mitra
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create default permissions for lpk_mitra module for existing roles
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete)
SELECT 
  r.role,
  'lpk_mitra'::app_module,
  CASE 
    WHEN r.role = 'admin' THEN true
    WHEN r.role = 'moderator' THEN true
    ELSE false
  END as can_view,
  CASE 
    WHEN r.role = 'admin' THEN true
    WHEN r.role = 'moderator' THEN true
    ELSE false
  END as can_create,
  CASE 
    WHEN r.role = 'admin' THEN true
    WHEN r.role = 'moderator' THEN true
    ELSE false
  END as can_update,
  CASE 
    WHEN r.role = 'admin' THEN true
    ELSE false
  END as can_delete
FROM (
  SELECT DISTINCT role FROM public.role_permissions
) r
ON CONFLICT (role, module) DO NOTHING;

-- Enable RLS on lpk_mitra table
ALTER TABLE public.lpk_mitra ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lpk_mitra
CREATE POLICY "Users can view lpk_mitra based on permissions" ON public.lpk_mitra
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.role_permissions rp
      JOIN public.user_roles ur ON ur.role = rp.role
      WHERE ur.user_id = auth.uid()
        AND rp.module = 'lpk_mitra'
        AND rp.can_view = true
    )
  );

CREATE POLICY "Users can create lpk_mitra based on permissions" ON public.lpk_mitra
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.role_permissions rp
      JOIN public.user_roles ur ON ur.role = rp.role
      WHERE ur.user_id = auth.uid()
        AND rp.module = 'lpk_mitra'
        AND rp.can_create = true
    )
  );

CREATE POLICY "Users can update lpk_mitra based on permissions" ON public.lpk_mitra
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.role_permissions rp
      JOIN public.user_roles ur ON ur.role = rp.role
      WHERE ur.user_id = auth.uid()
        AND rp.module = 'lpk_mitra'
        AND rp.can_update = true
    )
  );

CREATE POLICY "Users can delete lpk_mitra based on permissions" ON public.lpk_mitra
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.role_permissions rp
      JOIN public.user_roles ur ON ur.role = rp.role
      WHERE ur.user_id = auth.uid()
        AND rp.module = 'lpk_mitra'
        AND rp.can_delete = true
    )
  );
