<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DemografiProvince;
use App\Models\DemografiRegency;

class DemografiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getProvinces(Request $request)
    {
        $query = \App\Models\DemografiProvince::where('is_active', true);
        
        if ($request->has('country_id') && $request->country_id) {
            $query->where('country_id', $request->country_id);
        }

        return response()->json($query->orderBy('nama')->get());
    }

    public function getRegencies(Request $request)
    {
        $query = \App\Models\DemografiRegency::where('is_active', true);
        
        if ($request->has('province_id')) {
            $query->where('province_id', $request->province_id);
        }

        return response()->json($query->orderBy('nama')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
