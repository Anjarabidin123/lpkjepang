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
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'subject' => 'required|string',
            'score' => 'required|integer',
            'exam_date' => 'required|date',
            'result' => 'required|in:pass,fail,remidi',
            'teacher_comments' => 'nullable|string'
        ]);

        $grade = StudentGrade::create($validated);
        return response()->json($grade, 201);
    }

    public function update(Request $request, $id)
    {
        $grade = StudentGrade::findOrFail($id);
        $validated = $request->validate([
            'siswa_id' => 'sometimes|required|exists:siswas,id',
            'subject' => 'sometimes|required|string',
            'score' => 'sometimes|required|integer',
            'exam_date' => 'sometimes|required|date',
            'result' => 'sometimes|required|in:pass,fail,remidi',
            'teacher_comments' => 'nullable|string'
        ]);

        $grade->update($validated);
        return response()->json($grade);
    }

    public function destroy($id)
    {
        $grade = StudentGrade::findOrFail($id);
        $grade->delete();
        return response()->json(['message' => 'Grade deleted']);
    }
}
