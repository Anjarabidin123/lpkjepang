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
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name',
                'display_name' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:500',
                'permissions' => 'nullable|array',
                'permissions.*' => 'exists:permissions,id'
            ]);

            // Create role with name and description only (display_name not in DB schema)
            $role = Role::create([
                'name' => $request->name,
                'description' => $request->description
            ]);

            // Attach permissions if provided
            if ($request->has('permissions') && is_array($request->permissions)) {
                $role->permissions()->sync($request->permissions);
            }

            return response()->json($role->load('permissions'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error creating role: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Server Error: ' . $e->getMessage(),
                'details' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    public function show($id)
    {
        return response()->json(Role::with('permissions')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        try {
            $role = Role::findOrFail($id);
            
            // PROTECT SUPER ADMIN ROLE
            if ($role->name === 'super_admin' || $role->id === 1) {
                return response()->json(['message' => 'Role Super Admin tidak dapat diubah.'], 403);
            }

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $id,
                'display_name' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:500',
                'permissions' => 'nullable|array',
                'permissions.*' => 'exists:permissions,id',
                'is_active' => 'nullable|boolean'
            ]);

            // Update only fields that exist in the database schema
            $updateData = [];
            if ($request->has('name')) {
                $updateData['name'] = $request->name;
            }
            if ($request->has('description')) {
                $updateData['description'] = $request->description;
            }
            
            if (!empty($updateData)) {
                $role->update($updateData);
            }
            
            // Update permissions if provided
            if ($request->has('permissions')) {
                $role->permissions()->sync($request->permissions);
            }

            return response()->json($role->load('permissions'));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Role not found'], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Error updating role: ' . $e->getMessage(), [
                'role_id' => $id,
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Server Error: ' . $e->getMessage(),
                'details' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
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
