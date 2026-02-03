<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Pemasukan;

class PemasukanController extends Controller
{
    public function index()
    {
        return response()->json(Pemasukan::with('kategori')->orderBy('tanggal_pemasukan', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = Pemasukan::create($request->all());
        return response()->json($data->load('kategori'), 201);
    }

    public function show($id)
    {
        return response()->json(Pemasukan::with('kategori')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = Pemasukan::findOrFail($id);
        $data->update($request->all());
        return response()->json($data->load('kategori'));
    }

    public function destroy($id)
    {
        Pemasukan::destroy($id);
        return response()->json(null, 204);
    }
}
