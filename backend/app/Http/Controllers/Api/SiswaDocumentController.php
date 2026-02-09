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
        $validated = $request->validate([
            'siswa_magang_id' => 'required|exists:siswa_magangs,id',
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx|max:5120', 
            'nama' => 'nullable|string',
            'document_template_id' => 'nullable|exists:document_templates,id',
            'keterangan' => 'nullable|string'
        ]);

        // SECURITY: Ownership Check
        $siswaMagang = \App\Models\SiswaMagang::with('siswa')->findOrFail($validated['siswa_magang_id']);
        $user = $request->user();
        $canManage = $user->hasPermission('document_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswaMagang->siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $file = $request->file('document');
        $path = $file->store('documents', 'local'); // Store in private 'local' disk

        $doc = SiswaDocument::create([
            'siswa_magang_id' => $validated['siswa_magang_id'],
            'document_template_id' => $request->document_template_id,
            'nama' => $request->nama ?? $file->getClientOriginalName(),
            'file_path' => $path, // Store relative path
            'status' => 'pending',
            'keterangan' => $request->keterangan
        ]);

        return response()->json($doc, 201);
    }

    public function update(Request $request, $id)
    {
        $doc = SiswaDocument::with('siswaMagang.siswa')->findOrFail($id);
        
        // SECURITY: Ownership Check
        $user = $request->user();
        $canManage = $user->hasPermission('document_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage) {
            // Must be owner
            if ($doc->siswaMagang->siswa->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized Access'], 403);
            }
            // Owner Restrictions
            if ($request->has('status')) {
                 return response()->json(['message' => 'Student cannot update status'], 403);
            }
        }

        $doc->update($request->only(['status', 'keterangan', 'nama']));
        return response()->json($doc);
    }

    public function destroy(Request $request, $id)
    {
        $doc = SiswaDocument::with('siswaMagang.siswa')->findOrFail($id);
        
        // SECURITY: Ownership Check
        $user = $request->user();
        $canManage = $user->hasPermission('document_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage) {
            // Must be owner
            if ($doc->siswaMagang->siswa->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized Access'], 403);
            }
            // Owner Restrictions
            if (!in_array(strtolower($doc->status), ['pending', 'ditolak', 'rejected'])) {
                 return response()->json(['message' => 'Cannot delete verified document'], 403);
            }
        }
        
        // PHYSICAL FILE CLEANUP
        if ($doc->file_path && \Storage::disk('local')->exists($doc->file_path)) {
            \Storage::disk('local')->delete($doc->file_path);
        }

        $doc->delete();
        return response()->json(null, 204);
    }

    public function initialize(Request $request)
    {
        $request->validate([
            'siswa_magang_id' => 'required|exists:siswa_magangs,id',
        ]);

        $siswaMagangId = $request->siswa_magang_id;
        
        // SECURITY: Ownership Check
        $siswaMagang = \App\Models\SiswaMagang::with('siswa')->findOrFail($siswaMagangId);
        $user = $request->user();
        $canManage = $user->hasPermission('document_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $siswaMagang->siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        // Get all required active templates
        $requiredTemplates = \App\Models\DocumentTemplate::where('is_required', true)
            ->where('is_active', true)
            ->get();

        $count = 0;

        foreach ($requiredTemplates as $template) {
            // Check if document already exists for this template and student
            $exists = SiswaDocument::where('siswa_magang_id', $siswaMagangId)
                ->where('document_template_id', $template->id)
                ->exists();

            if (!$exists) {
                SiswaDocument::create([
                    'siswa_magang_id' => $siswaMagangId,
                    'document_template_id' => $template->id,
                    'nama' => $template->nama,
                    'status' => 'pending', // Initial status
                    'file_path' => null, // No file yet
                    'keterangan' => 'Dokumen wajib diinisialisasi otomatis'
                ]);
                $count++;
            }
        }

        return response()->json([
            'message' => 'Initialization complete',
            'created' => $count
        ]);
    }

    public function download($id)
    {
        $doc = SiswaDocument::with('siswaMagang.siswa')->findOrFail($id);
        
        // SECURITY: Ownership Check
        $user = auth()->user();
        $canManage = $user->hasPermission('document_manage') || $user->roles->contains('name', 'super_admin');

        if (!$canManage && $doc->siswaMagang->siswa->user_id !== $user->id) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        if (!\Storage::disk('local')->exists($doc->file_path)) {
            return response()->json(['message' => 'File not found on server'], 404);
        }

        return \Storage::disk('local')->download($doc->file_path, $doc->nama);
    }
}
