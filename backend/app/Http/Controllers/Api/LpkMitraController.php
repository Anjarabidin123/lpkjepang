<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LpkMitra;

class LpkMitraController extends Controller
{
    public function index()
    {
        return response()->json(LpkMitra::all());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'kode' => 'nullable|string|unique:lpk_mitras,kode',
                'pic_nama' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'alamat' => 'nullable|string',
                'status' => 'nullable|string',
                'website' => 'nullable|string|max:255',
                'logo_url' => 'nullable|string',
            ]);
            
            $lpk = LpkMitra::create($validated);
            return response()->json($lpk, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            return response()->json(LpkMitra::findOrFail($id));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not Found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $lpk = LpkMitra::findOrFail($id);
            
            $validated = $request->validate([
                'nama' => 'sometimes|required|string|max:255',
                'kode' => 'nullable|string|unique:lpk_mitras,kode,'.$id,
                'pic_nama' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'alamat' => 'nullable|string',
                'status' => 'nullable|string',
                'website' => 'nullable|string|max:255',
                'logo_url' => 'nullable|string',
            ]);
            
            $lpk->update($validated);
            return response()->json($lpk);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        LpkMitra::destroy($id);
        return response()->json(null, 204);
    }
}
