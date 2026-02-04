<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RecruitmentApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecruitmentController extends Controller
{
    /**
     * Get recruitment statistics
     */
    public function getStats()
    {
        try {
            $newApplications = RecruitmentApplication::where('status', 'new')->count();
            $inReview = RecruitmentApplication::where('status', 'review')->count();
            $accepted = RecruitmentApplication::where('status', 'accepted')->count();
            
            $totalApplications = RecruitmentApplication::count();
            $successRate = $totalApplications > 0 
                ? round(($accepted / $totalApplications) * 100, 0) 
                : 0;

            return response()->json([
                'newApplications' => $newApplications,
                'inReview' => $inReview,
                'accepted' => $accepted,
                'successRate' => $successRate,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch recruitment stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of applications
     */
    public function index(Request $request)
    {
        try {
            $query = RecruitmentApplication::with(['siswa', 'program', 'reviewer']);

            $user = $request->user();
            if ($user && $user->roles->contains('name', 'student')) {
                $siswa = $user->siswa;
                if ($siswa) {
                    $query->where('siswa_id', $siswa->id);
                } else {
                    return response()->json([]);
                }
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by program
            if ($request->has('program_id')) {
                $query->where('program_id', $request->program_id);
            }

            // Search
            if ($request->has('search')) {
                $query->whereHas('siswa', function($q) use ($request) {
                    $q->where('nama', 'like', '%' . $request->search . '%')
                      ->orWhere('nik', 'like', '%' . $request->search . '%');
                });
            }

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $applications = $query->get();

            return response()->json($applications);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch applications',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created application
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'siswa_id' => 'required|exists:siswas,id',
                'program_id' => 'nullable|exists:programs,id',
                'application_date' => 'nullable|date',
            ]);

            $validated['application_number'] = RecruitmentApplication::generateApplicationNumber();
            $validated['application_date'] = $validated['application_date'] ?? now();
            $validated['status'] = 'new';

            $application = RecruitmentApplication::create($validated);
            $application->load(['siswa', 'program']);

            return response()->json($application, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to create application',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified application
     */
    public function show($id)
    {
        try {
            $application = RecruitmentApplication::with(['siswa', 'program', 'reviewer'])
                ->findOrFail($id);
            return response()->json($application);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Application not found',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified application
     */
    public function update(Request $request, $id)
    {
        try {
            $application = RecruitmentApplication::findOrFail($id);

            $validated = $request->validate([
                'status' => 'nullable|in:new,review,interview,accepted,rejected,withdrawn',
                'interview_date' => 'nullable|date',
                'interview_notes' => 'nullable|string',
                'score' => 'nullable|integer|min:0|max:100',
                'rejection_reason' => 'nullable|string',
            ]);

            // If status changed to review/interview/accepted/rejected, set reviewer
            if (isset($validated['status']) && 
                in_array($validated['status'], ['review', 'interview', 'accepted', 'rejected']) &&
                !$application->reviewed_by) {
                $validated['reviewed_by'] = Auth::id();
                $validated['reviewed_at'] = now();
            }

            $application->update($validated);
            $application->load(['siswa', 'program', 'reviewer']);

            return response()->json($application);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to update application',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified application
     */
    public function destroy($id)
    {
        try {
            $application = RecruitmentApplication::findOrFail($id);
            $application->delete();

            return response()->json(['message' => 'Application deleted successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete application',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
