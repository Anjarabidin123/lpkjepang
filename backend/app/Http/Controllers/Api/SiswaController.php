<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Siswa;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Siswa::with(['user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra']);

            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
            }

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            return response()->json($query->orderBy('nama')->get());
        } catch (\Exception $e) {
            return response()->json(['message' => 'Query Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'nullable|exists:users,id',
                'nama' => 'required|string|max:255',
                'nik' => 'required|string|max:20|unique:siswas,nik',
                'email' => 'nullable|email|max:255',
                'telepon' => 'nullable|string|max:20',
                'demografi_province_id' => 'nullable|exists:demografi_provinces,id',
                'demografi_regency_id' => 'nullable|exists:demografi_regencies,id',
                'program_id' => 'nullable|exists:programs,id',
                'posisi_kerja_id' => 'nullable|exists:posisi_kerjas,id',
                'lpk_mitra_id' => 'nullable|exists:lpk_mitras,id',
                'status' => 'nullable|string',
            ]);

            $siswa = Siswa::create($validated);
            return response()->json($siswa->load(['user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra']), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $siswa = Siswa::with([
                'user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra',
                'keluargaIndonesia', 'keluargaJepang', 'kontakKeluarga', 'pengalamanKerja'
            ])->findOrFail($id);
            return response()->json($siswa);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not Found', 'details' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $siswa = Siswa::findOrFail($id);
            
            $validated = $request->validate([
                'nama' => 'sometimes|required|string|max:255',
                'nik' => 'sometimes|required|string|max:20|unique:siswas,nik,'.$id,
                'email' => 'nullable|email|max:255',
                'telepon' => 'nullable|string|max:20',
                'demografi_province_id' => 'nullable|exists:demografi_provinces,id',
                'demografi_regency_id' => 'nullable|exists:demografi_regencies,id',
                'program_id' => 'nullable|exists:programs,id',
                'posisi_kerja_id' => 'nullable|exists:posisi_kerjas,id',
                'lpk_mitra_id' => 'nullable|exists:lpk_mitras,id',
                'status' => 'nullable|string',
            ]);
            
            $siswa->update($validated);
            return response()->json($siswa->load(['user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra']));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        Siswa::destroy($id);
        return response()->json(null, 204);
    }
}
