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
            
            // IMMUTABLE LEDGER: Prevent chaning critical fields
            // Only 'keterangan' (notes) can be updated to fix typos
            $validated = $request->validate([
                'keterangan' => 'nullable|string',
            ]);
            
            // Check if user tries to change other fields
            if ($request->hasAny(['jenis', 'kategori', 'nominal', 'tanggal'])) {
                 return response()->json([
                     'message' => 'Financial Integrity: Transaction details (Amount, Date, Type) cannot be edited. Please delete (if authorized) and re-create if necessary.'
                 ], 403);
            }
            
            $arusKas->update($validated);
            return response()->json($arusKas);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        if (!$user->roles->contains('name', 'super_admin')) {
             return response()->json(['message' => 'Only Super Admin can delete financial records.'], 403);
        }

        $arusKas = ArusKas::findOrFail($id);
        
        // AUDIT LOG
        \Illuminate\Support\Facades\Log::warning("FINANCIAL ALERT: Cash Flow ID {$id} (Nominal: {$arusKas->nominal}) deleted by {$user->email}");

        $arusKas->delete();
        return response()->json(null, 204);
    }
}
