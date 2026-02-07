<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentGrade;
use App\Models\Siswa;
use Illuminate\Http\Request;

class StudentGradeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->roles->contains('name', 'student')) {
            $siswa = $user->siswa;
            if (!$siswa) return response()->json([]);
            return StudentGrade::where('siswa_id', $siswa->id)->get();
        }

        return StudentGrade::with('siswa')->latest()->get();
    }

    public function store(Request $request)
    {
        // SECURITY
        if ($request->user()->roles->contains('name', 'student')) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'subject' => 'required|string',
            'score' => 'required|integer',
            'exam_date' => 'required|date',
            'result' => 'nullable|in:pass,fail,remidi',
            'teacher_comments' => 'nullable|string'
        ]);
        
        // Auto-calculate result if not provided? Or just validated.
        
        $grade = StudentGrade::create($validated);
        return response()->json($grade, 201);
    }

    public function update(Request $request, $id)
    {
        // SECURITY
        if ($request->user()->roles->contains('name', 'student')) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $grade = StudentGrade::findOrFail($id);
        $validated = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'subject' => 'sometimes|required|string',
            'score' => 'sometimes|required|integer',
            'exam_date' => 'sometimes|required|date',
            'result' => 'nullable|in:pass,fail,remidi',
            'teacher_comments' => 'nullable|string'
        ]);

        $grade->update($validated);
        return response()->json($grade);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->roles->contains('name', 'student')) {
             return response()->json(['message' => 'Unauthorized Access'], 403);
        }

        $grade = StudentGrade::findOrFail($id);
        $grade->delete();
        return response()->json(['message' => 'Grade deleted']);
    }
}
