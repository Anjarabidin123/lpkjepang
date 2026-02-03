<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Pengeluaran;

class PengeluaranController extends Controller
{
    public function index()
    {
        return response()->json(Pengeluaran::with('kategori')->orderBy('tanggal_pengeluaran', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = Pengeluaran::create($request->all());
        return response()->json($data->load('kategori'), 201);
    }

    public function show($id)
    {
        return response()->json(Pengeluaran::with('kategori')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = Pengeluaran::findOrFail($id);
        $data->update($request->all());
        return response()->json($data->load('kategori'));
    }

    public function destroy($id)
    {
        Pengeluaran::destroy($id);
        return response()->json(null, 204);
    }
}
