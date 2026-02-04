<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\KategoriPemasukan;

class KategoriPemasukanController extends Controller
{
    public function index()
    {
        return response()->json(KategoriPemasukan::orderBy('nama_kategori')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:225|unique:kategori_pemasukans,nama_kategori',
            'deskripsi' => 'nullable|string',
        ]);

        $data = KategoriPemasukan::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(KategoriPemasukan::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = KategoriPemasukan::findOrFail($id);
        
        $validated = $request->validate([
            'nama_kategori' => 'sometimes|required|string|max:225|unique:kategori_pemasukans,nama_kategori,'.$id,
            'deskripsi' => 'nullable|string',
        ]);

        $data->update($validated);
        return response()->json($data);
    }

    public function destroy($id)
    {
        KategoriPemasukan::destroy($id);
        return response()->json(null, 204);
    }
}
