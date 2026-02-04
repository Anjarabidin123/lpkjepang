<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Perusahaan;

class PerusahaanController extends Controller
{
    public function index()
    {
        return response()->json(Perusahaan::with('kumiai')->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'kode' => 'nullable|string|unique:perusahaans,kode',
                'alamat' => 'nullable|string',
                'email' => 'nullable|email|max:255',
                'kumiai_id' => 'nullable|exists:kumiais,id',
                'telepon' => 'nullable|string|max:20',
                'bidang_usaha' => 'nullable|string|max:255',
                'kapasitas' => 'nullable|integer',
                'tanggal_kerjasama' => 'nullable|date',
            ]);
            
            $perusahaan = Perusahaan::create($validated);
            return response()->json($perusahaan, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            return response()->json(Perusahaan::with('kumiai')->findOrFail($id));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not Found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $perusahaan = Perusahaan::findOrFail($id);
            
            $validated = $request->validate([
                'nama' => 'sometimes|required|string|max:255',
                'kode' => 'nullable|string|unique:perusahaans,kode,'.$id,
                'alamat' => 'nullable|string',
                'email' => 'nullable|email|max:255',
                'kumiai_id' => 'nullable|exists:kumiais,id',
                'telepon' => 'nullable|string|max:20',
                'bidang_usaha' => 'nullable|string|max:255',
                'kapasitas' => 'nullable|integer',
                'tanggal_kerjasama' => 'nullable|date',
            ]);
            
            $perusahaan->update($validated);
            return response()->json($perusahaan);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        Perusahaan::destroy($id);
        return response()->json(null, 204);
    }
}
