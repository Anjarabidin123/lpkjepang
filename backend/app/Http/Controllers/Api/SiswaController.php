<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Siswa;

class SiswaController extends Controller
{
    public function index()
    {
        return response()->json(Siswa::with(['province', 'regency', 'program', 'posisiKerja', 'lpkMitra'])->get());
    }

    public function store(Request $request)
    {
        $siswa = Siswa::create($request->all());
        return response()->json($siswa, 201);
    }

    public function show($id)
    {
        return response()->json(Siswa::with(['province', 'regency', 'program', 'posisiKerja', 'lpkMitra'])->findOrFail($id));
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
