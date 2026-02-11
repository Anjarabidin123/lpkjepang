# ✅ FIXED: Error 500 pada Role Management

## 🐛 Masalah yang Ditemukan

### Error Sebelumnya:
```
POST /api/roles → 500 Server Error
Error in createRole: Error: Server Error
```

### Root Cause:
1. **Frontend mengirim `display_name`** (yang tidak ada di database schema)
2. **Backend tidak handle field tersebut** dengan baik
3. **Kurang error handling** yang detail di controller

## ✅ Solusi yang Diterapkan

### 1. Update RoleController::store() 
**File**: `backend/app/Http/Controllers/Api/RoleController.php`

**Perubahan**:
- ✅ Tambah validasi untuk `display_name` (nullable)
- ✅ Hanya simpan field yang ada di database (`name`, `description`)
- ✅ Tambah try-catch untuk error handling
- ✅ Log error ke Laravel log untuk debugging
- ✅ Return error message yang lebih informatif

### 2. Update RoleController::update()
**Perubahan yang sama**:
- ✅ Handle `display_name` dari frontend
- ✅ Tambah validasi `is_active` untuk toggle status
- ✅ Better error handling dengan detail error message

### 3. Struktur Database vs Frontend

**Database Schema (roles table)**:
```sql
- id
- name (unique, required)
- description (nullable)
- created_at
- updated_at
```

**Frontend Request Body**:
```json
{
  "name": "role_name",
  "display_name": "Display Name", // ← Dikirim tapi tidak disimpan ke DB
  "description": "Description",
  "permission_ids": [1, 2, 3]
}
```

**Backend Response**:
```json
{
  "id": 6,
  "name": "role_name",
  "description": "Description",
  "created_at": "2026-02-11T10:00:00.000000Z",
  "updated_at": "2026-02-11T10:00:00.000000Z",
  "permissions": [...]
}
```

## 🧪 Testing

### Manual Test - Create Role

**1. Via API (Postman/cURL)**:
```bash
curl -X POST https://web-production-23a1e.up.railway.app/api/roles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test_role",
    "display_name": "Test Role",
    "description": "Testing role creation",
    "permissions": [1, 2]
  }'
```

**Expected Response** (201 Created):
```json
{
  "id": 6,
  "name": "test_role",
  "description": "Testing role creation",
  "permissions": [
    {"id": 1, "name": "siswa_access"},
    {"id": 2, "name": "finance_access"}
  ]
}
```

### Manual Test - Via Frontend

1. Login ke https://web-production-23a1e.up.railway.app
2. Masuk ke **System Management → Role Management**
3. Klik **"Buat Peran Baru"**
4. Isi form:
   - Name: `manager`
   - Display Name: `Manager`
   - Description: `Manager role for daily operations`
   - Pilih beberapa permissions
5. Klik **Save**
6. ✅ Role berhasil dibuat tanpa error 500

## 📝 Validation Rules

### Create Role (POST /api/roles)
```php
'name' => 'required|string|max:255|unique:roles,name'
'display_name' => 'nullable|string|max:255'  // frontend only
'description' => 'nullable|string|max:500'
'permissions' => 'nullable|array'
'permissions.*' => 'exists:permissions,id'
```

### Update Role (PUT /api/roles/{id})
```php
'name' => 'sometimes|required|string|max:255|unique:roles,name,{id}'
'display_name' => 'nullable|string|max:255'
'description' => 'nullable|string|max:500'
'permissions' => 'nullable|array'
'permissions.*' => 'exists:permissions,id'
'is_active' => 'nullable|boolean'  // untuk toggle status
```

## 🔍 Debugging Tips

### Jika masih error 500:

1. **Check Laravel Log**:
```bash
cd backend
tail -f storage/logs/laravel.log
```

2. **Enable Debug Mode** (jangan di production!):
```env
# .env
APP_DEBUG=true
```

3. **Test dengan cURL untuk lihat response detail**:
```bash
curl -v -X POST https://web-production-23a1e.up.railway.app/api/roles \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"test","description":"test"}'
```

## 🎯 Next Steps

Setelah fix ini, Anda seharusnya bisa:
1. ✅ Membuat role baru
2. ✅ Edit role yang ada
3. ✅ Assign permissions ke role
4. ✅ Toggle status role (aktif/nonaktif)
5. ✅ Delete role (kecuali super_admin)

## ⚠️ Catatan Penting

1. **Super Admin Protected**: Role `super_admin` tidak bisa diubah atau dihapus
2. **Display Name**: Field ini hanya untuk frontend display, tidak disimpan ke database
3. **Permissions Sync**: Gunakan `sync()` bukan `attach()` agar tidak duplikasi
4. **Validation**: Semua error validation akan return 422 dengan detail error

## 🚀 Deploy

Jika aplikasi sudah di Railway:
```bash
git add .
git commit -m "fix: resolve 500 error on role management create/update"
git push origin main
```

Railway akan auto-deploy changes.
