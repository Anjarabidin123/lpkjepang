<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentVariable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DocumentVariableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $variables = DocumentVariable::all();
        return response()->json($variables);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|unique:document_variables,nama',
            'display_name' => 'required|string',
            'kategori' => 'required|string',
            'source_table' => 'required|string',
            'source_field' => 'required|string',
            'format_type' => 'nullable|string',
            'default_value' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $variable = DocumentVariable::create($request->all());

        return response()->json($variable, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $variable = DocumentVariable::find($id);

        if (!$variable) {
            return response()->json(['message' => 'Variable not found'], 404);
        }

        return response()->json($variable);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $variable = DocumentVariable::find($id);

        if (!$variable) {
            return response()->json(['message' => 'Variable not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|required|string|unique:document_variables,nama,' . $id,
            'display_name' => 'sometimes|required|string',
            'kategori' => 'sometimes|required|string',
            'source_table' => 'sometimes|required|string',
            'source_field' => 'sometimes|required|string',
            'format_type' => 'nullable|string',
            'default_value' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $variable->update($request->all());

        return response()->json($variable);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $variable = DocumentVariable::find($id);

        if (!$variable) {
            return response()->json(['message' => 'Variable not found'], 404);
        }

        $variable->delete();

        return response()->json(['message' => 'Variable deleted successfully']);
    }
}
