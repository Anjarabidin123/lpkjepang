<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentAttendance;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->roles->contains('name', 'student')) {
            $siswa = $user->siswa;
            if (!$siswa) return response()->json([]);
            return StudentAttendance::where('siswa_id', $siswa->id)->orderBy('date', 'desc')->get();
        }

        // Admin sees all, with filter support
        $query = StudentAttendance::with('siswa');
        if($request->has('date')) {
            $query->where('date', $request->date);
        }
        return $query->latest()->get();
    }

    public function bulkStore(Request $request)
    {
        // SECURITY: Students cannot do bulk attendance
        if ($request->user()->roles->contains('name', 'student')) {
             return response()->json(['message' => 'Unauthorized action for students'], 403);
        }

        $request->validate([
            'attendance' => 'required|array',
            'attendance.*.siswa_id' => 'required|exists:siswas,id',
            'attendance.*.status' => 'required|string',
            'attendance.*.date' => 'required|date',
        ]);

        foreach ($request->attendance as $item) {
            StudentAttendance::updateOrCreate(
                ['siswa_id' => $item['siswa_id'], 'date' => $item['date']],
                ['status' => $item['status'], 'notes' => $item['notes'] ?? null]
            );
        }

        return response()->json(['message' => 'Bulk attendance saved successfully']);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $isStudent = $user->roles->contains('name', 'student');

        // Validation Rules
        $rules = [
            'date' => 'required|date', 
            'status' => 'required|in:hadir,izin,sakit,alpha',
            'notes' => 'nullable|string'
        ];

        // If not student (Admin/Instructor), they must provide siswa_id
        if (!$isStudent) {
            $rules['siswa_id'] = 'required|exists:siswas,id';
        }

        $validated = $request->validate($rules);

        // SECURITY: Determine Target Siswa ID
        if ($isStudent) {
            $siswa = $user->siswa;
            if (!$siswa) return response()->json(['message' => 'Siswa profile not found'], 404);
            $targetSiswaId = $siswa->id;
            
            // Student restriction: Cannot manipulate dates far in past/future
            // STRICT: Must be TODAY.
            if ($validated['date'] !== now()->format('Y-m-d')) {
                 return response()->json(['message' => 'Attendance can only be submitted for today.'], 400);
            }
            
            // Check if already exists (immutable for student)
            $exists = StudentAttendance::where('siswa_id', $targetSiswaId)
                ->where('date', $validated['date'])
                ->exists();
                
            if ($exists) {
                return response()->json(['message' => 'Attendance already submitted. Contact admin for corrections.'], 403);
            }
            
        } else {
            $targetSiswaId = $validated['siswa_id'];
        }

        // ANTI-DUPLICATION: Use updateOrCreate
        $attendance = StudentAttendance::updateOrCreate(
            [
                'siswa_id' => $targetSiswaId,
                'date' => $validated['date']
            ],
            [
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? null
            ]
        );

        return response()->json($attendance, 201);
    }

    public function destroy($id)
    {
        $user = request()->user();
        if ($user->roles->contains('name', 'student')) {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $attendance = StudentAttendance::findOrFail($id);
        $attendance->delete();
        return response()->json(['message' => 'Attendance deleted']);
    }
}
