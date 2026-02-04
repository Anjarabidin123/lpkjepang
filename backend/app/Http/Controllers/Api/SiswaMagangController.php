<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiswaMagang;

class SiswaMagangController extends Controller
{
    public function index()
    {
        try {
            // Load all necessary relationships for the dashboard
            $data = SiswaMagang::with([
                'siswa', 
                'kumiai', 
                'perusahaan', 
                'program', 
                'jenisKerja', 
                'posisiKerja', 
                'lpkMitra', 
                'demografiProvince', 
                'demografiRegency'
            ])->orderBy('created_at', 'desc')->get();
            
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Query Error',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'siswa_id' => 'required|exists:siswas,id',
                'kumiai_id' => 'nullable|exists:kumiais,id',
                'perusahaan_id' => 'nullable|exists:perusahaans,id',
                'program_id' => 'nullable|exists:programs,id',
                'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
                'posisi_kerja_id' => 'nullable|exists:posisi_kerjas,id',
                'lpk_mitra_id' => 'nullable|exists:lpk_mitras,id',
                'demografi_province_id' => 'nullable|exists:demografi_provinces,id',
                'demografi_regency_id' => 'nullable|exists:demografi_regencies,id',
                'lokasi' => 'nullable|string',
                'tanggal_mulai_kerja' => 'nullable|date',
                'tanggal_pulang_kerja' => 'nullable|date',
                'gaji' => 'nullable|numeric',
                'status_magang' => 'nullable|string',
                'avatar_url' => 'nullable|string',
            ]);
            
            $siswaMagang = SiswaMagang::create($validated);
            
            return response()->json($siswaMagang->load([
                'siswa', 'kumiai', 'perusahaan', 'program', 
                'jenisKerja', 'posisiKerja', 'lpkMitra'
            ]), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $data = SiswaMagang::with([
                'siswa', 'kumiai', 'perusahaan', 'program', 
                'jenisKerja', 'posisiKerja', 'lpkMitra',
                'demografiProvince', 'demografiRegency'
            ])->findOrFail($id);
            
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not Found', 'details' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $siswaMagang = SiswaMagang::findOrFail($id);
            
            $validated = $request->validate([
                'siswa_id' => 'sometimes|required|exists:siswas,id',
                'kumiai_id' => 'nullable|exists:kumiais,id',
                'perusahaan_id' => 'nullable|exists:perusahaans,id',
                'program_id' => 'nullable|exists:programs,id',
                'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
                'posisi_kerja_id' => 'nullable|exists:posisi_kerjas,id',
                'lpk_mitra_id' => 'nullable|exists:lpk_mitras,id',
                'demografi_province_id' => 'nullable|exists:demografi_provinces,id',
                'demografi_regency_id' => 'nullable|exists:demografi_regencies,id',
                'lokasi' => 'nullable|string',
                'tanggal_mulai_kerja' => 'nullable|date',
                'tanggal_pulang_kerja' => 'nullable|date',
                'gaji' => 'nullable|numeric',
                'status_magang' => 'nullable|string',
                'avatar_url' => 'nullable|string',
            ]);
            
            $siswaMagang->update($validated);
            
            return response()->json($siswaMagang->load([
                'siswa', 'kumiai', 'perusahaan', 'program', 
                'jenisKerja', 'posisiKerja', 'lpkMitra'
            ]));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        SiswaMagang::destroy($id);
        return response()->json(null, 204);
    }
}
