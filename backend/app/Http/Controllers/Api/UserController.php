<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('roles')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
            'roles' => ['array'], // Array ID role
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
        ]);

        if ($request->has('roles')) {
            // SECURITY: Only Super Admin can assign Super Admin role
            $requestedRoles = \App\Models\Role::whereIn('id', $request->roles)->get();
            $hasSuperAdmin = $requestedRoles->contains('name', 'super_admin');
            
            $currentUser = $request->user();
            // Check if current user is super admin (assuming relation loaded or check manually)
            // Ideally current user roles are loaded by auth middleware sanotum
            $isSuperAdmin = $currentUser->roles->contains('name', 'super_admin');

            if ($hasSuperAdmin && !$isSuperAdmin) {
                return response()->json(['message' => 'Anda tidak memiliki otoritas untuk menetapkan role Super Admin.'], 403);
            }

            $user->roles()->sync($request->roles);
        }

        return response()->json($user->load('roles'), 201);
    }

    public function show($id)
    {
        return response()->json(User::with('roles')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,'.$id],
            'password' => ['sometimes', 'confirmed', Rules\Password::defaults()],
            'phone' => ['nullable', 'string', 'max:20'],
            'roles' => ['array'],
        ]);

        if ($request->has('name')) $user->name = $request->name;
        if ($request->has('email')) $user->email = $request->email;
        if ($request->has('phone')) $user->phone = $request->phone;
        if ($request->filled('password')) $user->password = Hash::make($request->password);
        
        $user->save();

        if ($request->has('roles')) {
            // SECURITY: Only Super Admin can assign Super Admin role
            $requestedRoles = \App\Models\Role::whereIn('id', $request->roles)->get();
            $hasSuperAdmin = $requestedRoles->contains('name', 'super_admin');
            
            $currentUser = $request->user();
            $isSuperAdmin = $currentUser->roles->contains('name', 'super_admin');

            if ($hasSuperAdmin && !$isSuperAdmin) {
                 return response()->json(['message' => 'Anda tidak memiliki otoritas untuk menetapkan role Super Admin.'], 403);
            }
            
            $user->roles()->sync($request->roles);
        }

        return response()->json($user->load('roles'));
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // 1. Prevent Self-Deletion (Suicide)
        if ($id == auth()->id()) {
            return response()->json(['message' => 'Anda tidak dapat menghapus akun Anda sendiri.'], 403);
        }

        // 2. Prevent Deleting Last Super Admin
        if ($user->roles->contains('name', 'super_admin')) {
            $superAdminCount = User::whereHas('roles', function($q) {
                $q->where('name', 'super_admin');
            })->count();
            
            if ($superAdminCount <= 1) {
                return response()->json(['message' => 'Tidak dapat menghapus Super Admin terakhir.'], 403);
            }
        }

        $user->delete();
        return response()->json(null, 204);
    }
}
