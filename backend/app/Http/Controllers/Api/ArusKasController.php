<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ArusKas;

class ArusKasController extends Controller
{
    public function index()
    {
        return response()->json(ArusKas::orderBy('tanggal', 'desc')->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'jenis' => 'required|string',
                'kategori' => 'required|string',
                'nominal' => 'required|numeric',
                'tanggal' => 'required|date',
                'keterangan' => 'nullable|string',
            ]);

            $arusKas = ArusKas::create($validated);
            return response()->json($arusKas, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            return response()->json(ArusKas::findOrFail($id));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not Found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $arusKas = ArusKas::findOrFail($id);
            
            $validated = $request->validate([
                'jenis' => 'sometimes|required|string',
                'kategori' => 'sometimes|required|string',
                'nominal' => 'sometimes|required|numeric',
                'tanggal' => 'sometimes|required|date',
                'keterangan' => 'nullable|string',
            ]);
            
            $arusKas->update($validated);
            return response()->json($arusKas);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        ArusKas::destroy($id);
        return response()->json(null, 204);
    }
}
