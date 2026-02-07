<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiswaKontakKeluarga;

class SiswaKontakKeluargaController extends Controller
{
    public function index(Request $request)
    {
        $query = SiswaKontakKeluarga::query();
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
            'alamat' => 'nullable|string',
            'rt_rw' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'kab_kota' => 'nullable|string',
            'provinsi' => 'nullable|string',
            'kode_pos' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'penghasilan_per_bulan' => 'nullable|numeric',
            'telepon' => 'nullable|string',
        ]);

        // SECURITY: Ownership Check
        $siswa = \App\Models\Siswa::findOrFail($validated['siswa_id']);
        $user = $request->user();
        $canManage = $user->hasPermission('siswa_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $data = SiswaKontakKeluarga::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        // SECURITY: Ownership Check
        $data = SiswaKontakKeluarga::findOrFail($id);
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
        $data = SiswaKontakKeluarga::findOrFail($id);
        
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
            'alamat' => 'nullable|string',
            'rt_rw' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'kab_kota' => 'nullable|string',
            'provinsi' => 'nullable|string',
            'kode_pos' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'penghasilan_per_bulan' => 'nullable|numeric',
            'telepon' => 'nullable|string', // Keep telepon as alias or extra
        ]);
        
        $data->update($validated);
        return response()->json($data);
    }

    public function destroy(Request $request, $id)
    {
        $data = SiswaKontakKeluarga::findOrFail($id);
        
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
