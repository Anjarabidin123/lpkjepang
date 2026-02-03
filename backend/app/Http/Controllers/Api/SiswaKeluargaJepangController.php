<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiswaKeluargaJepang;

class SiswaKeluargaJepangController extends Controller
{
    public function index(Request $request)
    {
        $query = SiswaKeluargaJepang::query();
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = SiswaKeluargaJepang::create($request->all());
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(SiswaKeluargaJepang::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = SiswaKeluargaJepang::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }

    public function destroy($id)
    {
        SiswaKeluargaJepang::destroy($id);
        return response()->json(null, 204);
    }
}
