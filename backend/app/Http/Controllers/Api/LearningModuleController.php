<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LearningModule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LearningModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $modules = LearningModule::with('author:id,name')->latest()->get();
        return response()->json([
            'status' => 'success',
            'data' => $modules
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // SECURITY
        $user = $request->user();
        if (!$user->hasPermission('education_manage') && !$user->roles->contains('name', 'super_admin')) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'type' => 'required|string|in:pdf,video,link',
            'url' => 'required|string', 
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $module = LearningModule::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'type' => $request->type,
            'url' => $request->url,
            'author_id' => $user->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Materi berhasil ditambahkan',
            'data' => $module
        ], 201);
    }

    public function show($id)
    {
        $module = LearningModule::find($id);
        if (!$module) return response()->json(['message' => 'Module not found'], 404);
        return response()->json(['data' => $module]);
    }

    public function update(Request $request, $id)
    {
        // SECURITY
        $user = $request->user();
        if (!$user->hasPermission('education_manage') && !$user->roles->contains('name', 'super_admin')) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $module = LearningModule::find($id);
        if (!$module) return response()->json(['message' => 'Module not found'], 404);

        $module->update($request->only(['title', 'description', 'category', 'type', 'url']));
        return response()->json(['status' => 'success', 'data' => $module]);
    }

    public function destroy($id)
    {
        // SECURITY
        $user = request()->user();
        if (!$user->hasPermission('education_manage') && !$user->roles->contains('name', 'super_admin')) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $module = LearningModule::find($id);
        if (!$module) return response()->json(['message' => 'Module not found'], 404);
        
        $module->delete();
        return response()->json(['status' => 'success', 'message' => 'Materi dihapus']);
    }
}
