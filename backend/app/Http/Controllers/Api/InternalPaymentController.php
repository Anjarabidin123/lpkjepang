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
        $data = InternalPayment::create($request->all());
        return response()->json($data->load(['siswa', 'itemPembayaran']), 201);
    }

    public function show($id)
    {
        return response()->json(InternalPayment::with(['siswa', 'itemPembayaran'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = InternalPayment::findOrFail($id);
        $data->update($request->all());
        return response()->json($data->load(['siswa', 'itemPembayaran']));
    }

    public function destroy($id)
    {
        InternalPayment::destroy($id);
        return response()->json(null, 204);
    }
}
