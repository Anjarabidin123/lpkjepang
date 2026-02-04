<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ItemPembayaran;

class ItemPembayaranController extends Controller
{
    public function index()
    {
        return response()->json(ItemPembayaran::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_item' => 'required|string|max:225',
            'nominal_default' => 'nullable|numeric',
            'deskripsi' => 'nullable|string',
        ]);

        $data = ItemPembayaran::create($validated);
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(ItemPembayaran::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = ItemPembayaran::findOrFail($id);
        
        $validated = $request->validate([
            'nama_item' => 'sometimes|required|string|max:225',
            'nominal_default' => 'nullable|numeric',
            'deskripsi' => 'nullable|string',
        ]);

        $data->update($validated);
        return response()->json($data);
    }

    public function destroy($id)
    {
        ItemPembayaran::destroy($id);
        return response()->json(null, 204);
    }
}
