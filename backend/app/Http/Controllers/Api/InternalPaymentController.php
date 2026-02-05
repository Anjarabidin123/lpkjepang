<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\InternalPayment;

class InternalPaymentController extends Controller
{
    public function index()
    {
        return response()->json(InternalPayment::with(['siswa', 'itemPembayaran'])->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'item_pembayaran_id' => 'required|exists:item_pembayaran,id',
            'nominal' => 'required|numeric',
            'tanggal_pembayaran' => 'required|date',
            'metode_pembayaran' => 'nullable|string',
            'referensi_transaksi' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $data = InternalPayment::create($validated);
        return response()->json($data->load(['siswa', 'itemPembayaran']), 201);
    }

    public function show($id)
    {
        return response()->json(InternalPayment::with(['siswa', 'itemPembayaran'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = InternalPayment::findOrFail($id);
        
        $validated = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'item_pembayaran_id' => 'sometimes|required|exists:item_pembayaran,id',
            'nominal' => 'sometimes|required|numeric',
            'tanggal_pembayaran' => 'sometimes|required|date',
            'metode_pembayaran' => 'nullable|string',
            'referensi_transaksi' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $data->update($validated);
        return response()->json($data->load(['siswa', 'itemPembayaran']));
    }

    public function destroy($id)
    {
        InternalPayment::destroy($id);
        return response()->json(null, 204);
    }
}
