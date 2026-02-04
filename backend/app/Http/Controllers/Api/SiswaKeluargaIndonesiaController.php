<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiswaKeluargaIndonesia;

class SiswaKeluargaIndonesiaController extends Controller
{
    public function index(Request $request)
    {
        $query = SiswaKeluargaIndonesia::query();
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }
        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'nama' => 'required|string',
            'hubungan' => 'nullable|string',
            'umur' => 'nullable|integer',
            'pekerjaan' => 'nullable|string',
        ]);

        $data = SiswaKeluargaIndonesia::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(SiswaKeluargaIndonesia::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = SiswaKeluargaIndonesia::findOrFail($id);
        
        $validated = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'nama' => 'sometimes|required|string',
            'hubungan' => 'nullable|string',
            'umur' => 'nullable|integer',
            'pekerjaan' => 'nullable|string',
        ]);
        
        $data->update($validated);
        return response()->json($data);
    }

    public function destroy($id)
    {
        SiswaKeluargaIndonesia::destroy($id);
        return response()->json(null, 204);
    }
}
