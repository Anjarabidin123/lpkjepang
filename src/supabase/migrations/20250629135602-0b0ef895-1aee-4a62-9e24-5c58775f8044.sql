
-- Add lpk_mitra permissions for existing roles only
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete) VALUES
('admin', 'lpk_mitra', true, true, true, true),
('moderator', 'lpk_mitra', true, true, true, false),
('user', 'lpk_mitra', true, false, false, false)
ON CONFLICT (role, module) DO NOTHING;
