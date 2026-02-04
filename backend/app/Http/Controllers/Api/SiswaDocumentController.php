<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiswaDocument;
use Illuminate\Support\Facades\Storage;

class SiswaDocumentController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Load with siswaMagang instead of template to avoid issues
            $query = SiswaDocument::query();
            
            $user = $request->user();
            if ($user && $user->roles->contains('name', 'student')) {
                $siswa = $user->siswa;
                if ($siswa) {
                    $magangIds = $siswa->siswaMagang()->pluck('id');
                    $query->whereIn('siswa_magang_id', $magangIds);
                } else {
                    return response()->json([]);
                }
            } elseif ($request->has('siswa_magang_id')) {
                $query->where('siswa_magang_id', $request->siswa_magang_id);
            }

            $documents = $query->with('template')->get();
            return response()->json($documents);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch documents',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'siswa_magang_id' => 'required|exists:siswa_magangs,id',
            'document' => 'required|file|max:10240', // Max 10MB
            'nama' => 'nullable|string',
            'document_template_id' => 'nullable|exists:document_templates,id',
            'keterangan' => 'nullable|string'
        ]);

        $file = $request->file('document');
        $path = $file->store('public/documents');
        
        // Generate public URL (ensure storage:link is run)
        $url = Storage::url($path);

        $doc = SiswaDocument::create([
            'siswa_magang_id' => $request->siswa_magang_id,
            'document_template_id' => $request->document_template_id,
            'nama' => $request->nama ?? $file->getClientOriginalName(),
            'file_path' => $url,
            'status' => 'pending',
            'keterangan' => $request->keterangan
        ]);

        return response()->json($doc, 201);
    }

    public function update(Request $request, $id)
    {
        $doc = SiswaDocument::findOrFail($id);
        $doc->update($request->only(['status', 'keterangan', 'nama']));
        return response()->json($doc);
    }

    public function destroy($id)
    {
        $doc = SiswaDocument::findOrFail($id);
        
        // Optional: Delete physical file
        // Storage::delete(str_replace('/storage/', 'public/', $doc->file_path));

        $doc->delete();
        return response()->json(null, 204);
    }
}
