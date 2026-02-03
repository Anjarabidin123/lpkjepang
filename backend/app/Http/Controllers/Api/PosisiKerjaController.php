<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PosisiKerja;

class PosisiKerjaController extends Controller
{
    public function index()
    {
        return response()->json(PosisiKerja::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'kode' => 'required|string|unique:posisi_kerjas,kode',
            'posisi' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'perusahaan_id' => 'nullable|exists:perusahaans,id',
            'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
            'lokasi' => 'nullable|string',
            'kuota' => 'nullable|integer',
            'terisi' => 'nullable|integer',
            'gaji_harian' => 'nullable|numeric',
            'jam_kerja' => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'status' => 'nullable|string',
            'tanggal_buka' => 'nullable|date',
            'tanggal_tutup' => 'nullable|date',
        ]);

        // If nama is not provided, use posisi as nama
        if (!isset($validated['nama'])) {
            $validated['nama'] = $validated['posisi'];
        }

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
            'nama' => 'sometimes|string|max:255',
            'kode' => 'sometimes|required|string|unique:posisi_kerjas,kode,'.$id,
            'posisi' => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
            'perusahaan_id' => 'nullable|exists:perusahaans,id',
            'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
            'lokasi' => 'nullable|string',
            'kuota' => 'nullable|integer',
            'terisi' => 'nullable|integer',
            'gaji_harian' => 'nullable|numeric',
            'jam_kerja' => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'status' => 'nullable|string',
            'tanggal_buka' => 'nullable|date',
            'tanggal_tutup' => 'nullable|date',
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
