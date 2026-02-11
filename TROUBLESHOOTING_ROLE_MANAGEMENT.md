# Troubleshooting: Menu Role Management Tidak Bisa Diakses

## 🔍 Diagnosis
Anda tidak bisa mengakses menu **Role Management** meskipun sudah login sebagai super admin.

## ✅ Solusi

### Opsi 1: Gunakan Artisan Command (RECOMMENDED)

#### 1.1 Check semua user dan role mereka
```bash
cd backend
php artisan user:check-roles
```

Output akan menampilkan tabel seperti ini:
```
┌────┬──────────────────┬─────────────────────────┬──────────────┬──────────────┐
│ ID │ Nama             │ Email                   │ Roles        │ Super Admin? │
├────┼──────────────────┼─────────────────────────┼──────────────┼──────────────┤
│ 1  │ Super Admin      │ superadmin@lpkujc.com  │ super_admin  │ ✅           │
│ 2  │ Admin           │ admin@lpkujc.com       │ admin        │ ❌           │
└────┴──────────────────┴─────────────────────────┴──────────────┴──────────────┘
```

#### 1.2 Check dan fix user tertentu
```bash
php artisan user:check-roles superadmin@lpkujc.com
```

Jika user tidak punya role super_admin, command akan menawarkan untuk assign role tersebut.

### Opsi 2: Manual via Database

#### 2.1 Check data di database
```sql
-- Check semua users
SELECT u.id, u.name, u.email, GROUP_CONCAT(r.name) as roles
FROM users u
LEFT JOIN role_user ru ON u.id = ru.user_id
LEFT JOIN roles r ON ru.role_id = r.id
GROUP BY u.id, u.name, u.email;
```

#### 2.2 Assign role super_admin manual
```sql
-- Pastikan role super_admin ada
SELECT * FROM roles WHERE name = 'super_admin';

-- Jika tidak ada, buat dulu:
INSERT INTO roles (name, description, created_at, updated_at) 
VALUES ('super_admin', 'Super Administrator', NOW(), NOW());

-- Assign role ke user (ganti USER_ID dan ROLE_ID sesuai data Anda)
INSERT INTO role_user (user_id, role_id, created_at, updated_at)
VALUES (1, 1, NOW(), NOW());
```

### Opsi 3: Re-run Seeder

Jika database masih fresh:

```bash
cd backend

# Run seeder untuk Role & Permission
php artisan db:seed --class=RolePermissionSeeder

# Run seeder untuk User (akan membuat user super admin)
php artisan db:seed --class=UserSeeder
```

Kredensial default super admin:
- **Email**: `superadmin@lpkujc.com`
- **Password**: `1234qwer`

### Opsi 4: Buat User Super Admin Baru (via Tinker)

```bash
cd backend
php artisan tinker
```

Kemudian jalankan:
```php
// Buat atau ambil role super_admin
$role = \App\Models\Role::firstOrCreate(['name' => 'super_admin']);

// Buat user baru atau ambil yang sudah ada
$user = \App\Models\User::where('email', 'superadmin@lpkujc.com')->first();

// Jika user belum ada, buat baru
if (!$user) {
    $user = \App\Models\User::create([
        'name' => 'Super Admin',
        'email' => 'superadmin@lpkujc.com',
        'password' => bcrypt('1234qwer'),
    ]);
}

// Assign role
$user->roles()->syncWithoutDetaching([$role->id]);

// Verifikasi
$user->load('roles');
echo "User: " . $user->email . "\n";
echo "Roles: " . $user->roles->pluck('name')->join(', ') . "\n";
```

## 🧪 Verifikasi Setelah Fix

### 1. Check via API (gunakan Postman atau cURL)

#### 1.1 Login dulu
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@lpkujc.com","password":"1234qwer"}'
```

Simpan token yang didapat.

#### 1.2 Check user info dengan token
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response seharusnya menampilkan:
```json
{
  "id": 1,
  "name": "Super Admin",
  "email": "superadmin@lpkujc.com",
  "roles": [
    {
      "id": 1,
      "name": "super_admin"
    }
  ]
}
```

#### 1.3 Test akses ke endpoint roles
```bash
curl -X GET http://localhost:8000/api/roles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Jika berhasil, akan mengembalikan list roles. Jika gagal dengan error 403, berarti role belum ter-assign dengan benar.

### 2. Check di Browser

Setelah fix:
1. Logout dari aplikasi
2. Login lagi menggunakan `superadmin@lpkujc.com` / `1234qwer`
3. Coba akses menu **System Management > Role Management**
4. Seharusnya tidak ada error lagi 🎉

## 📝 Penjelasan Teknis

### Mengapa Ini Terjadi?

1. **Relasi Many-to-Many**: User dan Role terhubung melalui tabel `role_user`
2. **Middleware Protection**: Route `/api/roles` dilindungi oleh middleware `role:super_admin`
3. **Frontend Filter**: Menu hanya muncul jika `allowedRoles` includes user's role

### Alur Check Permission

```
USER LOGIN 
  ↓
Load User dengan Roles (eager loading)
  ↓
Frontend: Check menuConfig.allowedRoles
  ↓
Menu muncul jika role cocok
  ↓
USER CLICK Menu
  ↓
Backend: Middleware CheckRole
  ↓
Check apakah user punya role 'super_admin'
  ↓
✅ ALLOW atau ❌ DENY (403)
```

## 🐛 Debugging Tips

Jika masih ada masalah:

1. **Check console log browser**: Buka DevTools (F12) → Console, lihat error apa yang muncul
2. **Check network tab**: Lihat response dari API `/api/roles` - apakah 401, 403, atau 500?
3. **Check Laravel log**: `backend/storage/logs/laravel.log`
4. **Enable debug mode**: Di `.env` set `APP_DEBUG=true`

## 📞 Jika Masih Gagal

Jika semua cara di atas tidak berhasil, ada kemungkinan:

1. **Database migration belum dijalankan**: `php artisan migrate`
2. **Cache issue**: `php artisan config:clear && php artisan cache:clear`
3. **Frontend state issue**: Clear localStorage, logout, dan login lagi

**Hubungi saya dengan informasi berikut:**
- Output dari `php artisan user:check-roles`
- Screenshot error yang muncul
- Response dari API `/api/user` setelah login
