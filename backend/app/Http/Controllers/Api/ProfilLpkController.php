<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProfilLpk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfilLpkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $profiles = ProfilLpk::all();
        return response()->json($profiles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'pemilik' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'logo_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $profile = ProfilLpk::create($request->all());

        return response()->json($profile, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $profile = ProfilLpk::find($id);

        if (!$profile) {
            return response()->json(['message' => 'Profil LPK not found'], 404);
        }

        return response()->json($profile);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $profile = ProfilLpk::find($id);

        if (!$profile) {
            return response()->json(['message' => 'Profil LPK not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|required|string|max:255',
            'pemilik' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'no_telp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'logo_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $profile->update($request->all());

        return response()->json($profile);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $profile = ProfilLpk::find($id);

        if (!$profile) {
            return response()->json(['message' => 'Profil LPK not found'], 404);
        }

        $profile->delete();

        return response()->json(['message' => 'Profil LPK deleted successfully']);
    }
}
