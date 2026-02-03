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
        $perusahaan = Perusahaan::create($request->all());
        return response()->json($perusahaan, 201);
    }

    public function show($id)
    {
        return response()->json(Perusahaan::with('kumiai')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $perusahaan = Perusahaan::findOrFail($id);
        $perusahaan->update($request->all());
        return response()->json($perusahaan);
    }

    public function destroy($id)
    {
        Perusahaan::destroy($id);
        return response()->json(null, 204);
    }
}
