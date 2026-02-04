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
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'jenjang_pendidikan' => 'required|string',
            'nama_institusi' => 'required|string',
            'jurusan' => 'nullable|string',
            'tahun_masuk' => 'nullable|integer',
            'tahun_lulus' => 'nullable|integer',
            'nilai_akhir' => 'nullable|string',
            'sertifikat_url' => 'nullable|string',
        ]);

        $data = SiswaPendidikan::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(SiswaPendidikan::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = SiswaPendidikan::findOrFail($id);
        
        $validated = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'jenjang_pendidikan' => 'sometimes|required|string',
            'nama_institusi' => 'sometimes|required|string',
            'jurusan' => 'nullable|string',
            'tahun_masuk' => 'nullable|integer',
            'tahun_lulus' => 'nullable|integer',
            'nilai_akhir' => 'nullable|string',
            'sertifikat_url' => 'nullable|string',
        ]);
        
        $data->update($validated);
        return response()->json($data);
    }

    public function destroy($id)
    {
        SiswaPendidikan::destroy($id);
        return response()->json(null, 204);
    }
}
