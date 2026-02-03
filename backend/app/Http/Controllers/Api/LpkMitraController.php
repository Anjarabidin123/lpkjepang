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
        $lpk = LpkMitra::create($request->all());
        return response()->json($lpk, 201);
    }

    public function show($id)
    {
        return response()->json(LpkMitra::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $lpk = LpkMitra::findOrFail($id);
        $lpk->update($request->all());
        return response()->json($lpk);
    }

    public function destroy($id)
    {
        LpkMitra::destroy($id);
        return response()->json(null, 204);
    }
}
