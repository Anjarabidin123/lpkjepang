<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiswaPengalamanKerja;

class SiswaPengalamanKerjaController extends Controller
{
    public function index(Request $request)
    {
        $query = SiswaPengalamanKerja::query();
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = SiswaPengalamanKerja::create($request->all());
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(SiswaPengalamanKerja::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = SiswaPengalamanKerja::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }

    public function destroy($id)
    {
        SiswaPengalamanKerja::destroy($id);
        return response()->json(null, 204);
    }
}
