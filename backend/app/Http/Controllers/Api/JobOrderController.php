<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class JobOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Sesuaikan nama relasi jika perlu. Asumsi relasi di model sudah ada (atau nanti saya cek)
        return response()->json(
            \App\Models\JobOrder::with(['kumiai', 'jenisKerja'])->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama_job_order' => 'required|string|max:255',
                'kumiai_id' => 'required|exists:kumiais,id',
                'perusahaan_id' => 'nullable|exists:perusahaans,id',
                'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
                'kuota' => 'required|integer|min:1',
                'status' => 'required|string',
                'tanggal_job_order' => 'nullable|date',
                'catatan' => 'nullable|string',
            ]);

            $jobOrder = \App\Models\JobOrder::create($validated);
            return response()->json($jobOrder, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return response()->json(
            \App\Models\JobOrder::with(['kumiai', 'jenisKerja'])->findOrFail($id)
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nama_job_order' => 'sometimes|required|string|max:255',
                'kumiai_id' => 'sometimes|required|exists:kumiais,id',
                'perusahaan_id' => 'nullable|exists:perusahaans,id',
                'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
                'kuota' => 'sometimes|required|integer|min:1',
                'status' => 'sometimes|required|string',
                'tanggal_job_order' => 'nullable|date',
                'catatan' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => 'Validation Error', 'errors' => $validator->errors()], 422);
            }

            $jobOrder = \App\Models\JobOrder::findOrFail($id);
            $jobOrder->update($validator->validated());
            return response()->json($jobOrder);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            \App\Models\JobOrder::destroy($id);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }
}
