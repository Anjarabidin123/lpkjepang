<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentTracking;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DocumentTrackingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Jika user adalah siswa, kembalikan hanya data tracking miliknya
        if ($user->roles->contains('name', 'student')) {
            $siswa = $user->siswa;
            if (!$siswa) {
                return response()->json([], 200);
            }
            return DocumentTracking::with('siswa')->where('siswa_id', $siswa->id)->get();
        }

        // Jika bukan siswa (Admin/Super Admin), kembalikan semua data dengan filter
        $query = DocumentTracking::with('siswa');

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('siswa', function($q) use ($search) {
                $q->where('nama', 'like', "%$search%")
                  ->orWhere('nik', 'like', "%$search%");
            });
        }

        return $query->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'passport_status' => 'string',
            'passport_expiry' => 'nullable|date',
            'mcu_status' => 'string',
            'mcu_date' => 'nullable|date',
            'language_cert_status' => 'string',
            'language_cert_level' => 'nullable|string',
            'coe_status' => 'string',
            'coe_number' => 'nullable|string',
            'coe_issue_date' => 'nullable|date',
            'visa_status' => 'string',
            'visa_expiry' => 'nullable|date',
            'flight_status' => 'string',
            'departure_datetime' => 'nullable|date',
            'notes' => 'nullable|string'
        ]);

        $tracking = DocumentTracking::updateOrCreate(
            ['siswa_id' => $validated['siswa_id']],
            $validated
        );

        return response()->json([
            'message' => 'Tracking updated successfully',
            'data' => $tracking
        ]);
    }

    public function show($id)
    {
        return DocumentTracking::with('siswa')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $tracking = DocumentTracking::findOrFail($id);
        $tracking->update($request->all());
        
        return response()->json([
            'message' => 'Tracking updated successfully',
            'data' => $tracking
        ]);
    }

    public function destroy($id)
    {
        $tracking = DocumentTracking::findOrFail($id);
        $tracking->delete();
        return response()->json(['message' => 'Tracking deleted successfully']);
    }

    public function getStats()
    {
        return [
            'total' => DocumentTracking::count(),
            'coe_approved' => DocumentTracking::where('coe_status', 'approved')->count(),
            'visa_granted' => DocumentTracking::where('visa_status', 'granted')->count(),
            'departed' => DocumentTracking::where('flight_status', 'departed')->count(),
        ];
    }
}
