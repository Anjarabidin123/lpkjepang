<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiswaPendidikan;

class SiswaPendidikanController extends Controller
{
    public function index(Request $request)
    {
        $query = SiswaPendidikan::query();
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }
        return response()->json($query->orderBy('tahun_masuk', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = SiswaPendidikan::create($request->all());
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(SiswaPendidikan::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = SiswaPendidikan::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }

    public function destroy($id)
    {
        SiswaPendidikan::destroy($id);
        return response()->json(null, 204);
    }
}
