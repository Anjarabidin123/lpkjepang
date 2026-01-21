-- Add new modules to app_module enum
ALTER TYPE app_module ADD VALUE 'siswa_magang';
ALTER TYPE app_module ADD VALUE 'job_order';
ALTER TYPE app_module ADD VALUE 'rekrutmen';
ALTER TYPE app_module ADD VALUE 'pembayaran';
ALTER TYPE app_module ADD VALUE 'arus_kas';
ALTER TYPE app_module ADD VALUE 'invoice';
ALTER TYPE app_module ADD VALUE 'monitoring';
ALTER TYPE app_module ADD VALUE 'pengaturan';
ALTER TYPE app_module ADD VALUE 'report';

-- Insert default permissions for all roles for the new modules
INSERT INTO public.role_permissions (role, module, can_view, can_create, can_update, can_delete) VALUES
-- siswa_magang permissions
('admin', 'siswa_magang', true, true, true, true),
('moderator', 'siswa_magang', true, true, true, false),
('user', 'siswa_magang', true, false, false, false),
('rekrutment', 'siswa_magang', true, true, true, false),

-- job_order permissions
('admin', 'job_order', true, true, true, true),
('moderator', 'job_order', true, true, true, false),
('user', 'job_order', true, false, false, false),
('rekrutment', 'job_order', true, true, true, false),

-- rekrutmen permissions
('admin', 'rekrutmen', true, true, true, true),
('moderator', 'rekrutmen', true, true, true, false),
('user', 'rekrutmen', true, false, false, false),
('rekrutment', 'rekrutmen', true, true, true, true),

-- pembayaran permissions
('admin', 'pembayaran', true, true, true, true),
('moderator', 'pembayaran', true, true, true, false),
('user', 'pembayaran', true, false, false, false),
('rekrutment', 'pembayaran', true, false, false, false),

-- arus_kas permissions
('admin', 'arus_kas', true, true, true, true),
('moderator', 'arus_kas', true, false, false, false),
('user', 'arus_kas', true, false, false, false),
('rekrutment', 'arus_kas', false, false, false, false),

-- invoice permissions
('admin', 'invoice', true, true, true, true),
('moderator', 'invoice', true, true, true, false),
('user', 'invoice', true, false, false, false),
('rekrutment', 'invoice', true, false, false, false),

-- monitoring permissions
('admin', 'monitoring', true, true, true, true),
('moderator', 'monitoring', true, false, false, false),
('user', 'monitoring', true, false, false, false),
('rekrutment', 'monitoring', true, false, false, false),

-- pengaturan permissions
('admin', 'pengaturan', true, true, true, true),
('moderator', 'pengaturan', false, false, false, false),
('user', 'pengaturan', false, false, false, false),
('rekrutment', 'pengaturan', false, false, false, false),

-- report permissions
('admin', 'report', true, true, true, true),
('moderator', 'report', true, false, false, false),
('user', 'report', true, false, false, false),
('rekrutment', 'report', true, false, false, false)

ON CONFLICT (role, module) DO NOTHING;