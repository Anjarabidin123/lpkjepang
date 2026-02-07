<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobOrderPeserta;

class JobOrderPesertaController extends Controller
{
    public function index(Request $request)
    {
        $query = JobOrderPeserta::with('siswa');
        
        if ($request->has('job_order_id')) {
            $query->where('job_order_id', $request->job_order_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_order_id' => 'required|exists:job_orders,id',
            'siswa_id' => 'required|exists:siswas,id',
        ]);
        
        // Prevent duplicates
        $exists = JobOrderPeserta::where('job_order_id', $request->job_order_id)
            ->where('siswa_id', $request->siswa_id)
            ->exists();
            
        if ($exists) {
            return response()->json(['message' => 'Siswa sudah terdaftar di Job Order ini'], 422);
        }

        // BUSINESS LOGIC: Prevent adding already ACTIVE students to a new pool
        // Check SiswaMagang table for active status
        $isActive = \App\Models\SiswaMagang::where('siswa_id', $request->siswa_id)
            ->whereIn('status_magang', ['aktif', 'diterima', 'active'])
            ->exists();

        if ($isActive) {
            return response()->json(['message' => 'Siswa sedang Aktif di Job Order lain dan tidak dapat ditambahkan ke kandidat.'], 400);
        }

        return response()->json(JobOrderPeserta::create($validated), 201);
    }

    public function show($id)
    {
        return response()->json(JobOrderPeserta::with('siswa')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $peserta = JobOrderPeserta::findOrFail($id);
        
        $validated = $request->validate([
            'job_order_id' => 'sometimes|required|exists:job_orders,id',
            'siswa_id' => 'sometimes|required|exists:siswas,id',
        ]);

        $peserta->update($validated);
        return response()->json($peserta);
    }

    public function destroy($id)
    {
        JobOrderPeserta::destroy($id);
        return response()->json(null, 204);
    }
}
