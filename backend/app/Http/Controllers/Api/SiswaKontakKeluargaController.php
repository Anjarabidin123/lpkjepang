<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SiswaKontakKeluarga;

class SiswaKontakKeluargaController extends Controller
{
    public function index(Request $request)
    {
        $query = SiswaKontakKeluarga::query();
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
            'alamat' => 'nullable|string',
            'rt_rw' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'kab_kota' => 'nullable|string',
            'provinsi' => 'nullable|string',
            'kode_pos' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'penghasilan_per_bulan' => 'nullable|numeric',
        ]);

        $data = SiswaKontakKeluarga::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(SiswaKontakKeluarga::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = SiswaKontakKeluarga::findOrFail($id);
        
        $validated = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'nama' => 'sometimes|required|string',
            'alamat' => 'nullable|string',
            'rt_rw' => 'nullable|string',
            'kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'kab_kota' => 'nullable|string',
            'provinsi' => 'nullable|string',
            'kode_pos' => 'nullable|string',
            'no_hp' => 'nullable|string',
            'penghasilan_per_bulan' => 'nullable|numeric',
        ]);
        
        $data->update($validated);
        return response()->json($data);
    }

    public function destroy($id)
    {
        SiswaKontakKeluarga::destroy($id);
        return response()->json(null, 204);
    }
}
