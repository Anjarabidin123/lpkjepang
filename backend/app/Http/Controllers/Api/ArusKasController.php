<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ArusKas;

class ArusKasController extends Controller
{
    public function index()
    {
        return response()->json(ArusKas::orderBy('tanggal', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'jenis' => 'required|string',
            'kategori' => 'required|string',
            'nominal' => 'required|numeric',
            'tanggal' => 'required|date',
        ]);

        $arusKas = ArusKas::create($request->all());
        return response()->json($arusKas, 201);
    }

    public function show($id)
    {
        return response()->json(ArusKas::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $arusKas = ArusKas::findOrFail($id);
        $arusKas->update($request->all());
        return response()->json($arusKas);
    }

    public function destroy($id)
    {
        ArusKas::destroy($id);
        return response()->json(null, 204);
    }
}
