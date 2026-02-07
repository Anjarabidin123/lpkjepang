<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DocumentTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = DocumentTemplate::orderBy('urutan', 'asc')->get();
        return response()->json($templates);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // SECURITY
        $user = $request->user();
        if (!$user->hasPermission('master_access') && !$user->roles->contains('name', 'super_admin')) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $validator = Validator::make($request->all(), [
            'kode' => 'required|string|unique:document_templates,kode',
            'nama' => 'required|string',
            'kategori' => 'required|string',
            'deskripsi' => 'nullable|string',
            'template_content' => 'nullable|string',
            'is_active' => 'boolean',
            'is_required' => 'boolean',
            'urutan' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $template = DocumentTemplate::create($request->all());

        return response()->json($template, 201);
    }

    public function show($id)
    {
        $template = DocumentTemplate::find($id);

        if (!$template) {
            return response()->json(['message' => 'Template not found'], 404);
        }

        return response()->json($template);
    }

    public function update(Request $request, $id)
    {
        // SECURITY
        $user = $request->user();
        if (!$user->hasPermission('master_access') && !$user->roles->contains('name', 'super_admin')) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $template = DocumentTemplate::find($id);

        if (!$template) {
            return response()->json(['message' => 'Template not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'kode' => 'sometimes|required|string|unique:document_templates,kode,' . $id,
            'nama' => 'sometimes|required|string',
            'kategori' => 'sometimes|required|string',
            'deskripsi' => 'nullable|string',
            'template_content' => 'nullable|string',
            'is_active' => 'boolean',
            'is_required' => 'boolean',
            'urutan' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $template->update($request->all());

        return response()->json($template);
    }

    public function destroy(Request $request, $id)
    {
        // SECURITY
        $user = $request->user();
        if (!$user->hasPermission('master_access') && !$user->roles->contains('name', 'super_admin')) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $template = DocumentTemplate::find($id);

        if (!$template) {
            return response()->json(['message' => 'Template not found'], 404);
        }

        $template->delete();

        return response()->json(['message' => 'Template deleted successfully']);
    }
}
