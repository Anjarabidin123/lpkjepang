<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\KewajibanPembayaran;

class KewajibanPembayaranController extends Controller
{
    public function index(Request $request)
    {
        $query = KewajibanPembayaran::with(['siswa', 'itemPembayaran']);
        if ($request->has('siswa_id')) {
            $query->where('siswa_id', $request->siswa_id);
        }
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = KewajibanPembayaran::create($request->all());
        return response()->json($data->load(['siswa', 'itemPembayaran']), 201);
    }

    public function show($id)
    {
        return response()->json(KewajibanPembayaran::with(['siswa', 'itemPembayaran'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = KewajibanPembayaran::findOrFail($id);
        $data->update($request->all());
        return response()->json($data->load(['siswa', 'itemPembayaran']));
    }

    public function destroy($id)
    {
        KewajibanPembayaran::destroy($id);
        return response()->json(null, 204);
    }
}
