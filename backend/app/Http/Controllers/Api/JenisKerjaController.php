<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JenisKerja;

class JenisKerjaController extends Controller
{
    public function index()
    {
        return response()->json(JenisKerja::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|unique:jenis_kerjas,kode',
            'kategori' => 'nullable|string',
        ]);

        $jenisKerja = JenisKerja::create($validated);
        return response()->json($jenisKerja, 201);
    }

    public function show($id)
    {
        return response()->json(JenisKerja::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $jenisKerja = JenisKerja::findOrFail($id);
        
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'kode' => 'sometimes|required|string|unique:jenis_kerjas,kode,'.$id,
            'kategori' => 'nullable|string',
        ]);

        $jenisKerja->update($validated);
        return response()->json($jenisKerja);
    }

    public function destroy($id)
    {
        JenisKerja::destroy($id);
        return response()->json(null, 204);
    }
}
