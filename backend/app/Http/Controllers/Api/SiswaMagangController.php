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
            // Try to load with relationships, but handle gracefully if they fail
            $data = SiswaMagang::with([
                'siswa', 'kumiai', 'perusahaan', 'program', 
                'jenisKerja', 'posisiKerja', 'lpkMitra', 
                'demografiProvince', 'demografiRegency'
            ])->get();
            return response()->json($data);
        } catch (\Exception $e) {
            // If relationships fail, return basic data
            try {
                $data = SiswaMagang::all();
                return response()->json($data);
            } catch (\Exception $e2) {
                return response()->json([
                    'error' => 'Failed to fetch siswa magang',
                    'message' => $e2->getMessage()
                ], 500);
            }
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
                'status_magang' => 'nullable|string',
            ]);
            
            $siswaMagang = SiswaMagang::create($request->all());
            
            return response()->json($siswaMagang->load('siswa'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return response()->json(
            SiswaMagang::with(['siswa', 'kumiai', 'perusahaan'])->findOrFail($id)
        );
    }

    public function update(Request $request, $id)
    {
        $siswaMagang = SiswaMagang::findOrFail($id);
        $siswaMagang->update($request->all());
        return response()->json($siswaMagang);
    }

    public function destroy($id)
    {
        SiswaMagang::destroy($id);
        return response()->json(null, 204);
    }
}
