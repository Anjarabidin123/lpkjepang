<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiswaPengalamanKerja;

class SiswaPengalamanKerjaController extends Controller
{
    public function index(Request $request)
    {
        $query = SiswaPengalamanKerja::query();
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'nama_perusahaan' => 'required|string',
            'jenis_pekerjaan' => 'nullable|string',
            'tahun_masuk' => 'nullable|integer',
            'tahun_keluar' => 'nullable|integer',
        ]);

        // SECURITY: Ownership Check
        $siswa = \App\Models\Siswa::findOrFail($validated['siswa_id']);
        $user = $request->user();
        $canManage = $user->hasPermission('siswa_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $data = SiswaPengalamanKerja::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        // SECURITY: Ownership Check
        $data = SiswaPengalamanKerja::findOrFail($id);
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
        $data = SiswaPengalamanKerja::findOrFail($id);
        
        // SECURITY: Ownership Check
        $siswa = \App\Models\Siswa::findOrFail($data->siswa_id);
        $user = $request->user();
        $canManage = $user->hasPermission('siswa_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $validated = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'nama_perusahaan' => 'sometimes|required|string',
            'jenis_pekerjaan' => 'nullable|string',
            'tahun_masuk' => 'nullable|integer',
            'tahun_keluar' => 'nullable|integer',
        ]);
        
        $data->update($validated);
        return response()->json($data);
    }

    public function destroy(Request $request, $id)
    {
        $data = SiswaPengalamanKerja::findOrFail($id);
        
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
