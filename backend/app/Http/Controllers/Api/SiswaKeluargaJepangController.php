<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiswaKeluargaJepang;

class SiswaKeluargaJepangController extends Controller
{
    public function index(Request $request)
    {
        $query = SiswaKeluargaJepang::query();
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'nama' => 'required|string',
            'hubungan' => 'nullable|string',
            'umur' => 'nullable|integer',
            'pekerjaan' => 'nullable|string',
        ]);

        // SECURITY: Ownership Check
        $siswa = \App\Models\Siswa::findOrFail($validated['siswa_id']);
        $user = $request->user();
        $canManage = $user->hasPermission('siswa_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $data = SiswaKeluargaJepang::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        // SECURITY: Ownership Check
        $data = SiswaKeluargaJepang::findOrFail($id);
        $siswa = \App\Models\Siswa::findOrFail($data->siswa_id);
        
        $user = request()->user();
        if ($user) {
            $canManage = $user->hasPermission('siswa_manage') || $user->roles->contains('name', 'super_admin');
            if (!$canManage && $siswa->user_id !== $user->id) {
                 return response()->json(['message' => 'Unauthorized Access'], 403);
            }
        }
        
        return response()->json($data);
    }

    public function update(Request $request, $id)
    {
        $data = SiswaKeluargaJepang::findOrFail($id);
        
        // SECURITY: Ownership Check
        $siswa = \App\Models\Siswa::findOrFail($data->siswa_id);
        $user = $request->user();
        $canManage = $user->hasPermission('siswa_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $validated = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'nama' => 'sometimes|required|string',
            'hubungan' => 'nullable|string',
            'umur' => 'nullable|integer',
            'pekerjaan' => 'nullable|string',
        ]);
        
        $data->update($validated);
        return response()->json($data);
    }

    public function destroy(Request $request, $id)
    {
        $data = SiswaKeluargaJepang::findOrFail($id);
        
        // SECURITY: Ownership Check
        $siswa = \App\Models\Siswa::findOrFail($data->siswa_id);
        $user = $request->user();
        $canManage = $user->hasPermission('siswa_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $data->delete();
        return response()->json(null, 204);
    }
}
