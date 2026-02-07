<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiswaPendidikan;

class SiswaPendidikanController extends Controller
{
    public function index(Request $request)
    {
        $query = SiswaPendidikan::query();
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }
        return response()->json($query->orderBy('tahun_masuk', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'jenjang_pendidikan' => 'required|string',
            'nama_institusi' => 'required|string',
            'jurusan' => 'nullable|string',
            'tahun_masuk' => 'nullable|integer',
            'tahun_lulus' => 'nullable|integer',
            'nilai_akhir' => 'nullable|string',
            'sertifikat_url' => 'nullable|string',
        ]);

        // SECURITY: Ownership Check
        $siswa = \App\Models\Siswa::findOrFail($validated['siswa_id']);
        $user = $request->user();
        $canManage = $user->hasPermission('siswa_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $data = SiswaPendidikan::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        // SECURITY: Ownership Check
        $data = SiswaPendidikan::findOrFail($id);
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
        $data = SiswaPendidikan::findOrFail($id);
        
        // SECURITY: Ownership Check
        $siswa = \App\Models\Siswa::findOrFail($data->siswa_id);
        $user = $request->user();
        $canManage = $user->hasPermission('siswa_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $validated = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'jenjang_pendidikan' => 'sometimes|required|string',
            'nama_institusi' => 'sometimes|required|string',
            'jurusan' => 'nullable|string',
            'tahun_masuk' => 'nullable|integer',
            'tahun_lulus' => 'nullable|integer',
            'nilai_akhir' => 'nullable|string',
            'sertifikat_url' => 'nullable|string',
        ]);
        
        $data->update($validated);
        return response()->json($data);
    }

    public function destroy(Request $request, $id)
    {
        $data = SiswaPendidikan::findOrFail($id);
        
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
