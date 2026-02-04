<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Siswa;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Siswa::with(['user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra']);

            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
            }

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            return response()->json($query->orderBy('nama')->get());
        } catch (\Exception $e) {
            return response()->json(['message' => 'Query Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $siswa = Siswa::create($request->all());
            return response()->json($siswa->load(['user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra']), 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $siswa = Siswa::with([
                'user', 'province', 'regency', 'program', 'posisiKerja', 'lpkMitra',
                'keluargaIndonesia', 'keluargaJepang', 'kontakKeluarga', 'pengalamanKerja'
            ])->findOrFail($id);
            return response()->json($siswa);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not Found', 'details' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);
        $siswa->update($request->all());
        return response()->json($siswa);
    }

    public function destroy($id)
    {
        Siswa::destroy($id);
        return response()->json(null, 204);
    }
}
