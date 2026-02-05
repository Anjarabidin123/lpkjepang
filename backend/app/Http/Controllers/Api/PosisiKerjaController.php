<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PosisiKerja;

class PosisiKerjaController extends Controller
{
    public function index()
    {
        return response()->json(PosisiKerja::with(['perusahaan', 'jenis_kerja'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode' => 'required|string|unique:posisi_kerjas,kode',
            'nama' => 'required|string|max:255',
            'posisi' => 'nullable|string',
            'lokasi' => 'nullable|string',
            'kuota' => 'nullable|integer',
            'terisi' => 'nullable|integer',
            'gaji_harian' => 'nullable|numeric',
            'jam_kerja' => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'status' => 'nullable|string',
            'tanggal_buka' => 'nullable|date',
            'tanggal_tutup' => 'nullable|date',
            'perusahaan_id' => 'nullable|exists:perusahaans,id',
            'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
        ]);


        $posisiKerja = PosisiKerja::create($validated);
        return response()->json($posisiKerja, 201);
    }

    public function show($id)
    {
        return response()->json(PosisiKerja::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $posisiKerja = PosisiKerja::findOrFail($id);
        
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'kode' => 'sometimes|required|string|unique:posisi_kerjas,kode,'.$id,
            'posisi' => 'nullable|string',
            'lokasi' => 'nullable|string',
            'kuota' => 'nullable|integer',
            'terisi' => 'nullable|integer',
            'gaji_harian' => 'nullable|numeric',
            'jam_kerja' => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'status' => 'nullable|string',
            'tanggal_buka' => 'nullable|date',
            'tanggal_tutup' => 'nullable|date',
            'perusahaan_id' => 'nullable|exists:perusahaans,id',
            'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
        ]);

        $posisiKerja->update($validated);
        return response()->json($posisiKerja);
    }

    public function destroy($id)
    {
        PosisiKerja::destroy($id);
        return response()->json(null, 204);
    }
}
