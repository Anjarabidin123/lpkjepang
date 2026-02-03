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
        $data = ItemPembayaran::create($request->all());
        return response()->json($data, 201);
    }

    public function show($id)
    {
        return response()->json(ItemPembayaran::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $data = ItemPembayaran::findOrFail($id);
        $data->update($request->all());
        return response()->json($data);
    }

    public function destroy($id)
    {
        ItemPembayaran::destroy($id);
        return response()->json(null, 204);
    }
}
