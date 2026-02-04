<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kumiai;

class KumiaiController extends Controller
{
    public function index()
    {
        return response()->json(Kumiai::with('perusahaan')->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'kode' => 'nullable|string|unique:kumiais,kode',
                'pic_nama' => 'nullable|string|max:255',
                'pic_telepon' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'alamat' => 'nullable|string',
                'telepon' => 'nullable|string|max:20',
                'tanggal_kerjasama' => 'nullable|date',
            ]);
            
            $kumiai = Kumiai::create($validated);
            return response()->json($kumiai, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            return response()->json(Kumiai::with('perusahaan')->findOrFail($id));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not Found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $kumiai = Kumiai::findOrFail($id);
            
            $validated = $request->validate([
                'nama' => 'sometimes|required|string|max:255',
                'kode' => 'nullable|string|unique:kumiais,kode,'.$id,
                'pic_nama' => 'nullable|string|max:255',
                'pic_telepon' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'alamat' => 'nullable|string',
                'telepon' => 'nullable|string|max:20',
                'tanggal_kerjasama' => 'nullable|date',
            ]);
            
            $kumiai->update($validated);
            return response()->json($kumiai);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        Kumiai::destroy($id);
        return response()->json(null, 204);
    }
}
