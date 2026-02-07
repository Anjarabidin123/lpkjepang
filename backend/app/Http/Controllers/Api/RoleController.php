<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json(Role::with('permissions')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'array'
        ]);

        $role = Role::create($request->only(['name', 'description']));

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json($role->load('permissions'), 201);
    }

    public function show($id)
    {
        return response()->json(Role::with('permissions')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        
        // PROTECT SUPER ADMIN ROLE
        if ($role->name === 'super_admin' || $role->id === 1) {
             return response()->json(['message' => 'Role Super Admin tidak dapat diubah.'], 403);
        }

        $role->update($request->only(['name', 'description']));
        
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json($role->load('permissions'));
    }

    public function destroy($id)
    {
        $role = Role::withCount('users')->findOrFail($id);

        if ($role->name === 'super_admin' || $role->id === 1) {
             return response()->json(['message' => 'Role Super Admin tidak dapat dihapus.'], 403);
        }

        if ($role->users_count > 0) {
            return response()->json([
                'message' => 'Role ini tidak dapat dihapus karena masih digunakan oleh ' . $role->users_count . ' users.',
                'details' => 'Silakan hapus role dari user terkait terlebih dahulu.'
            ], 400);
        }

        $role->delete();
        
        return response()->json(null, 204);
    }
}
