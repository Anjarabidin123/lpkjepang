<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\KategoriPengeluaran;

class KategoriPengeluaranController extends Controller
{
    public function index()
    {
        return response()->json(KategoriPengeluaran::orderBy('nama_kategori')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:225|unique:kategori_pengeluarans,nama_kategori',
            'deskripsi' => 'nullable|string',
        ]);

        $data = KategoriPengeluaran::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(KategoriPengeluaran::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = KategoriPengeluaran::findOrFail($id);
        
        $validated = $request->validate([
            'nama_kategori' => 'sometimes|required|string|max:225|unique:kategori_pengeluarans,nama_kategori,'.$id,
            'deskripsi' => 'nullable|string',
        ]);

        $data->update($validated);
        return response()->json($data);
    }

    public function destroy($id)
    {
        KategoriPengeluaran::destroy($id);
        return response()->json(null, 204);
    }
}
