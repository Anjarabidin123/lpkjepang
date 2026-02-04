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
            return StudentAttendance::where('siswa_id', $siswa->id)->get();
        }

        return StudentAttendance::with('siswa')->latest()->get();
    }

    public function bulkStore(Request $request)
    {
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
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'date' => 'required|date',
            'status' => 'required|in:hadir,izin,sakit,alpha',
            'notes' => 'nullable|string'
        ]);

        $attendance = StudentAttendance::create($validated);
        return response()->json($attendance, 201);
    }

    public function destroy($id)
    {
        $attendance = StudentAttendance::findOrFail($id);
        $attendance->delete();
        return response()->json(['message' => 'Attendance deleted']);
    }
}
