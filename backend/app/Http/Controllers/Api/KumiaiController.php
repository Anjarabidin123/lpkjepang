<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kumiai;

class KumiaiController extends Controller
{
    public function index()
    {
        return response()->json(Kumiai::with('perusahaan')->get());
    }

    public function store(Request $request)
    {
        $kumiai = Kumiai::create($request->all());
        return response()->json($kumiai, 201);
    }

    public function show($id)
    {
        return response()->json(Kumiai::with('perusahaan')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $kumiai = Kumiai::findOrFail($id);
        $kumiai->update($request->all());
        return response()->json($kumiai);
    }

    public function destroy($id)
    {
        Kumiai::destroy($id);
        return response()->json(null, 204);
    }
}
