# 🛡️ RBAC API Protection - Implementation Guide

## Overview
Backend API sekarang dilindungi dengan Role-Based Access Control (RBAC). Setiap endpoint memiliki pembatasan akses berdasarkan role user.

## Available Roles
1. **admin** - Full access ke semua fitur
2. **rekrutment** - Akses ke manajemen siswa, job order, dan master data
3. **keuangan** - Akses ke modul keuangan (arus kas, invoice, pembayaran)
4. **moderator** - Akses terbatas (bisa ditambahkan sesuai kebutuhan)

## API Route Protection

### 🔓 Public Routes (No Auth Required)
- `POST /api/login` - Login
- `GET /api/demografi/provinces` - Get provinces
- `GET /api/demografi/regencies` - Get regencies

### 🔐 Authenticated Routes (Auth Required)
**All authenticated users can access:**
- `GET /api/user` - Get current user info
- `POST /api/logout` - Logout
- `POST /api/user/change-password` - Change password
- `PUT /api/user/profile` - Update profile
- `GET /api/kumiai` - View kumiai (read-only for non-admin)
- `GET /api/perusahaan` - View perusahaan
- `GET /api/programs` - View programs
- `GET /api/jenis-kerja` - View jenis kerja
- `GET /api/posisi-kerja` - View posisi kerja

### 👑 Admin Only Routes
**Only `admin` role can access:**
- `/api/users/*` - User management (CRUD)
- `/api/roles/*` - Role management (CRUD)
- `/api/permissions/*` - Permission management (CRUD)

### 👥 Admin & Rekrutment Routes
**`admin` OR `rekrutment` role can access:**
- `/api/siswa/*` - Siswa management
- `/api/siswa-magang/*` - Siswa magang management
- `/api/job-orders/*` - Job order management
- `/api/job-order-peserta/*` - Job order participants
- `/api/siswa-documents/*` - Siswa documents
- `/api/siswa-keluarga-indonesia/*` - Siswa family (Indonesia)
- `/api/siswa-keluarga-jepang/*` - Siswa family (Japan)
- `/api/siswa-kontak-keluarga/*` - Siswa family contacts
- `/api/siswa-pengalaman-kerja/*` - Siswa work experience
- `/api/siswa-pendidikan/*` - Siswa education

### 💰 Admin & Keuangan Routes
**`admin` OR `keuangan` role can access:**
- `/api/arus-kas/*` - Cash flow management
- `/api/kategori-pemasukan/*` - Income categories
- `/api/pemasukan/*` - Income records
- `/api/kategori-pengeluaran/*` - Expense categories
- `/api/pengeluaran/*` - Expense records
- `/api/invoices/*` - Invoice management
- `/api/invoice-items/*` - Invoice items
- `/api/kewajiban-pembayaran/*` - Payment obligations
- `/api/item-pembayaran/*` - Payment items
- `/api/internal-payments/*` - Internal payments

## Testing RBAC

### Test 1: Admin Access
```bash
# Login as admin
POST /api/login
{
  "email": "admin@orchids.com",
  "password": "password"
}

# Try accessing admin-only route (Should succeed)
GET /api/users
Authorization: Bearer {token}
```

### Test 2: Rekrutment Access
```bash
# Login as rekrutment
POST /api/login
{
  "email": "rekrutment@orchids.com",
  "password": "password"
}

# Try accessing siswa route (Should succeed)
GET /api/siswa
Authorization: Bearer {token}

# Try accessing admin route (Should fail with 403)
GET /api/users
Authorization: Bearer {token}
```

### Test 3: Keuangan Access
```bash
# Login as keuangan
POST /api/login
{
  "email": "keuangan@orchids.com",
  "password": "password"
}

# Try accessing financial route (Should succeed)
GET /api/arus-kas
Authorization: Bearer {token}

# Try accessing siswa route (Should fail with 403)
GET /api/siswa
Authorization: Bearer {token}
```

## Error Responses

### 401 Unauthorized (No Token)
```json
{
  "message": "Unauthenticated"
}
```

### 403 Forbidden (Wrong Role)
```json
{
  "message": "Forbidden. Required role: admin or rekrutment",
  "your_roles": ["keuangan"]
}
```

## Frontend Integration

Frontend sudah otomatis handle error 403:
- Menu items filtered berdasarkan role
- Routes protected dengan `RoleBasedRoute` component
- API calls akan return error jika user tidak punya akses

## Adding New Protected Routes

```php
// For admin only
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::apiResource('new-resource', NewController::class);
});

// For multiple roles
Route::middleware(['auth:sanctum', 'role:admin,rekrutment'])->group(function () {
    Route::apiResource('shared-resource', SharedController::class);
});
```

## Security Best Practices

1. ✅ Always use `auth:sanctum` middleware first
2. ✅ Then add `role:` middleware for specific roles
3. ✅ Test with different user roles
4. ✅ Check frontend menu visibility matches backend permissions
5. ✅ Log security events for audit trail

## Demo Users

| Email | Password | Role | Access Level |
|-------|----------|------|--------------|
| admin@orchids.com | password | admin | Full access |
| rekrutment@orchids.com | password | rekrutment | Siswa & Job Orders |
| keuangan@orchids.com | password | keuangan | Financial modules |
| moderator@orchids.com | password | moderator | Limited access |

---

**Status:** ✅ RBAC Protection Active
**Last Updated:** 2026-02-01
