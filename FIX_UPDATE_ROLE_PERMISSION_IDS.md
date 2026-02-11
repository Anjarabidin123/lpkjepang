# Fix: Error 500 Saat Update Role - Invalid Permission IDs

## 🐛 Masalah
Saat mencoba **update role** (bukan create), muncul error 500:

```
SQLSTATE[22P02]: Invalid text representation: 7 ERROR:  
invalid input syntax for type bigint: "job_order_view_0"
```

## 🔍 Root Cause Analysis

### Diagram Flow Masalah:

```
USER clicks permission
  ↓
handlePermissionToggle(permissionId)
  ↓
selectedPermissions.push("job_order_view_0") ← STRING ID (FAKE)
  ↓
handleSubmit()
  ↓
Send to backend: permission_ids: ["job_order_view_0", "1", "2"]
  ↓
Backend validation: exists:permissions,id
  ↓
SQL: SELECT * FROM permissions WHERE id = 'job_order_view_0'
  ↓
PostgreSQL: ERROR! Cannot convert string to bigint
  ↓
500 Server Error ❌
```

### Detail Masalah:

**1. Fake/Default Permissions dengan String IDs**

File: `src/components/RbacRoleManagement/RbacRoleInlineForm.tsx` (Line 165-184)

```tsx
const getModulePermissionsWithDefaults = (module: string) => {
  // ... 
  return defaultActions.map((action, index) => ({
    id: `${module}_${action}_${index}`,  // ← STRING ID! misal: "job_order_view_0"
    name: `${module}.${action}`,
    // ...
  }));
};
```

Fungsi ini membuat **fake permissions** dengan ID string ketika permission untuk module tertentu tidak ada di database.

**2. selectedPermissions Menyimpan Campuran String & Number**

```tsx
const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
```

State ini menyimpan:
- ✅ Valid IDs dari database: `"1"`, `"2"`, `"3"` (number as string)
- ❌ Fake IDs: `"job_order_view_0"`, `"siswa_create_1"` (pure string)

**3. Backend Validation Gagal**

File: `backend/app/Http/Controllers/Api/RoleController.php`

```php
'permissions.*' => 'exists:permissions,id'
```

Validation ini check setiap permission_id di database. Query yang dijalankan:

```sql
SELECT count(*) as aggregate FROM "permissions" WHERE "id" = 'job_order_view_0'
```

PostgreSQL expect `id` column (type: bigint) tapi dapat string → **ERROR!**

## ✅ Solusi Implemented

### 1. Filter Permission IDs Before Sending

**File**: `src/components/RbacRoleManagement/RbacRoleInlineForm.tsx` (Line 234-259)

**Before (BROKEN)**:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const createData: CreateRoleData = {
    ...formData,
    permission_ids: selectedPermissions  // ← Kirim semua, termasuk string IDs!
  };
  // ...
};
```

**After (FIXED)**:
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Filter only valid numeric permission IDs
  const validPermissionIds = selectedPermissions
    .filter(id => {
      const numId = typeof id === 'number' ? id : parseInt(id, 10);
      return !isNaN(numId) && numId > 0;
    })
    .map(id => typeof id === 'number' ? id : parseInt(id, 10));
  
  console.log('Selected permissions (raw):', selectedPermissions);
  console.log('Valid permission IDs to send:', validPermissionIds);
  
  const createData: CreateRoleData = {
    ...formData,
    permission_ids: validPermissionIds  // ← Hanya kirim valid numeric IDs!
  };
  // ...
};
```

### 2. Fix Type Definitions

**File**: `src/types/rbac.ts`

**Before**:
```typescript
export interface CreateRoleData {
  name: string;
  display_name: string;
  description?: string;
  permission_ids?: string[];  // ← WRONG TYPE!
}
```

**After**:
```typescript
export interface CreateRoleData {
  name: string;
  display_name: string;
  description?: string;
  permission_ids?: number[];  // ← CORRECT TYPE (match DB bigint)
}
```

Juga di `UpdateRoleData`.

## 🧪 Testing

### Test Case 1: Create Role dengan Default Permissions

**Scenario**: User click fake permissions (yang belum ada di DB)

1. Open Role Management
2. Click "Buat Peran Baru"
3. Select permissions from modules that have fake/default permissions
4. Submit form

**Expected Before Fix**: ❌ Error 500
**Expected After Fix**: ✅ Role created, but fake permissions ignored (validPermissionIds = [])

### Test Case 2: Create Role dengan Real Permissions

**Scenario**: User click real permissions (yang ada di DB)

1. Select permissions from existing DB permissions
2. Click permissions: `siswa_access`, `finance_access`, etc
3. Submit

**Expected**: ✅ Success! Permission IDs `[1, 2, 3, ...]` sent correctly

### Test Case 3: Update Role

**Scenario**: Edit existing role

1. Click Edit on existing role
2. Add/remove permissions
3. Save

**Expected Before Fix**: ❌ Error 500 if any fake permission selected
**Expected After Fix**: ✅ Success! Only valid permission IDs sent

## 🔍 Debugging Log Example

After fix, console akan show:

```javascript
Selected permissions (raw): ["1", "2", "job_order_view_0", "3", "siswa_create_1"]
Valid permission IDs to send: [1, 2, 3]
// ← "job_order_view_0" dan "siswa_create_1" di-filter out!
```

## 📝 Files Changed

1. ✅ `src/components/RbacRoleManagement/RbacRoleInlineForm.tsx`
   - Added `validPermissionIds` filtering in `handleSubmit()`
   - Added console.log for debugging
   
2. ✅ `src/types/rbac.ts`
   - Changed `permission_ids` type from `string[]` to `number[]`
   - Updated both `CreateRoleData` and `UpdateRoleData`

3. ✅ `FIX_EDIT_BUTTON_ROLE_MANAGEMENT.md` (documentation)

## 💡 Recommended Next Steps

### Short Term: Current Solution Works ✅
Current fix ensures only valid permission IDs are sent to backend. This prevents the error.

### Long Term: Better Permission Management

**Option 1: Fetch All Real Permissions from Backend**
```tsx
// Instead of creating fake permissions, fetch real ones
useEffect(() => {
  const fetchAllPermissions = async () => {
    const perms = await PermissionService.fetchPermissions();
    setPermissions(perms); // All real permissions with numeric IDs
  };
  fetchAllPermissions();
}, []);
```

**Option 2: Create Permissions via Migration/Seeder**

Add backend seeder to create all possible permissions:

```php
// database/seeders/PermissionSeeder.php
$modules = ['job_order', 'siswa', 'kumiai', ...];
$actions = ['view', 'create', 'update', 'delete'];

foreach ($modules as $module) {
    foreach ($actions as $action) {
        Permission::firstOrCreate([
            'name' => "{$module}_{$action}",
            'description' => "...",
            'module' => $module,
            'action' => $action
        ]);
    }
}
```

Then run: `php artisan db:seed --class=PermissionSeeder`

**Option 3: Backend API to Create Permissions On-Demand**

When user tries to assign a non-existent permission, create it automatically:

```php
// In RoleController::store() or update()
foreach ($request->permissions as $permId) {
    if (!Permission::find($permId)) {
        // Create permission if not exists
        // OR return validation error
    }
}
```

## 🎯 Summary

| Aspect | Before | After |
|--------|--------|-------|
| Permission IDs Type | `string[]` | `number[]` ✅ |
| Fake IDs Handling | Crash (500) ❌ | Filtered out ✅ |
| Backend Validation | Fails on string IDs ❌ | Passes (only numeric) ✅ |
| Developer Experience | Confusing errors ❌ | Clear console logs ✅ |

## 🚀 Deploy

Files are committed and pushed:
- Commit: `28a6051`
- Branch: `main`
- Railway: Auto-deploying...

Wait ~2-3 minutes, then test!
