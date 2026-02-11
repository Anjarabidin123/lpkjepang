-- ============================================
-- SQL Script: Fix Super Admin Role Assignment
-- ============================================
-- Gunakan script ini untuk fix masalah role management
-- Jalankan di database PostgreSQL/MySQL Anda

-- 1. CHECK: Lihat semua users dan role mereka
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    r.id as role_id,
    r.name as role_name
FROM users u
LEFT JOIN role_user ru ON u.id = ru.user_id
LEFT JOIN roles r ON ru.role_id = r.id
ORDER BY u.id;

-- 2. CHECK: Apakah role super_admin sudah ada?
SELECT * FROM roles WHERE name = 'super_admin';

-- 3. FIX: Buat role super_admin jika belum ada
-- (Skip jika sudah ada)
INSERT INTO roles (name, description, created_at, updated_at)
SELECT 'super_admin', 'Super Administrator dengan akses penuh', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'super_admin');

-- 4. FIX: Assign role super_admin ke user tertentu
-- GANTI 'superadmin@lpkujc.com' dengan email user Anda!

-- Ambil ID role super_admin
DO $$
DECLARE
    v_role_id INTEGER;
    v_user_id INTEGER;
BEGIN
    -- Get role ID
    SELECT id INTO v_role_id FROM roles WHERE name = 'super_admin';
    
    -- Get user ID (GANTI EMAIL SESUAI DENGAN USER ANDA!)
    SELECT id INTO v_user_id FROM users WHERE email = 'superadmin@lpkujc.com';
    
    -- Check if user exists
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User tidak ditemukan! Silakan ganti email di script.';
    ELSE
        -- Remove existing role assignments for this user (optional)
        -- DELETE FROM role_user WHERE user_id = v_user_id;
        
        -- Assign super_admin role
        INSERT INTO role_user (user_id, role_id, created_at, updated_at)
        VALUES (v_user_id, v_role_id, NOW(), NOW())
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Role super_admin berhasil di-assign ke user ID: %', v_user_id;
    END IF;
END $$;

-- 5. VERIFY: Check apakah sudah ter-assign dengan benar
SELECT 
    u.id,
    u.name,
    u.email,
    r.name as role
FROM users u
JOIN role_user ru ON u.id = ru.user_id
JOIN roles r ON ru.role_id = r.id
WHERE r.name = 'super_admin';

-- ============================================
-- UNTUK MYSQL (jika menggunakan MySQL)
-- ============================================
-- Gunakan script ini sebagai gantinya:

-- Check role super_admin
-- SELECT * FROM roles WHERE name = 'super_admin';

-- Buat jika belum ada
-- INSERT INTO roles (name, description, created_at, updated_at)
-- SELECT 'super_admin', 'Super Administrator dengan akses penuh', NOW(), NOW()
-- FROM dual
-- WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'super_admin');

-- Assign role (GANTI EMAIL!)
-- SET @user_email = 'superadmin@lpkujc.com';
-- SET @user_id = (SELECT id FROM users WHERE email = @user_email LIMIT 1);
-- SET @role_id = (SELECT id FROM roles WHERE name = 'super_admin' LIMIT 1);

-- INSERT INTO role_user (user_id, role_id, created_at, updated_at)
-- SELECT @user_id, @role_id, NOW(), NOW()
-- WHERE @user_id IS NOT NULL AND @role_id IS NOT NULL
-- AND NOT EXISTS (
--     SELECT 1 FROM role_user 
--     WHERE user_id = @user_id AND role_id = @role_id
-- );

-- Verify
-- SELECT u.id, u.name, u.email, r.name as role
-- FROM users u
-- JOIN role_user ru ON u.id = ru.user_id
-- JOIN roles r ON ru.role_id = r.id
-- WHERE r.name = 'super_admin';
