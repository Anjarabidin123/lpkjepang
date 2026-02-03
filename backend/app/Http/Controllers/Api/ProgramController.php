<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;

class ProgramController extends Controller
{
    public function index()
    {
        return response()->json(Program::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|unique:programs,kode',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'durasi' => 'nullable|integer',
            'satuan_durasi' => 'nullable|string',
            'biaya' => 'nullable|numeric',
            'kuota' => 'nullable|integer',
            'peserta_terdaftar' => 'nullable|integer',
            'status' => 'nullable|string',
        ]);

        $program = Program::create($validated);
        return response()->json($program, 201);
    }

    public function show($id)
    {
        return response()->json(Program::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);
        
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'kode' => 'sometimes|required|string|unique:programs,kode,'.$id,
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'durasi' => 'nullable|integer',
            'satuan_durasi' => 'nullable|string',
            'biaya' => 'nullable|numeric',
            'kuota' => 'nullable|integer',
            'peserta_terdaftar' => 'nullable|integer',
            'status' => 'nullable|string',
        ]);

        $program->update($validated);
        return response()->json($program);
    }

    public function destroy($id)
    {
        Program::destroy($id);
        return response()->json(null, 204);
    }
}
