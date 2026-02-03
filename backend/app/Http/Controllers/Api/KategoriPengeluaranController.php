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
        $data = KategoriPengeluaran::create($request->all());
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(KategoriPengeluaran::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = KategoriPengeluaran::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }

    public function destroy($id)
    {
        KategoriPengeluaran::destroy($id);
        return response()->json(null, 204);
    }
}
