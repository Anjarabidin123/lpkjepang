<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiswaMagang;

class SiswaMagangController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = SiswaMagang::with([
                'siswa', 
                'kumiai', 
                'perusahaan', 
                'program', 
                'jenis_kerja', 
                'posisi_kerja', 
                'lpk_mitra', 
                'demografi_province', 
                'demografi_regency'
            ]);

            $user = $request->user();
            if ($user && $user->roles->contains('name', 'student')) {
                $siswa = $user->siswa;
                if ($siswa) {
                    $query->where('siswa_id', $siswa->id);
                } else {
                    return response()->json([]);
                }
            }

            // Filter by search (name or NIK)
            if ($request->has('search')) {
                $search = $request->search;
                $query->whereHas('siswa', function($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
                });
            }

            // Filter by relationships
            if ($request->has('kumiai_id') && $request->kumiai_id !== 'all') {
                $query->where('kumiai_id', $request->kumiai_id);
            }
            if ($request->has('perusahaan_id') && $request->perusahaan_id !== 'all') {
                $query->where('perusahaan_id', $request->perusahaan_id);
            }
            if ($request->has('status_magang') && $request->status_magang !== 'all') {
                $query->where('status_magang', $request->status_magang);
            }

            $data = $query->orderBy('created_at', 'desc')->get();
            
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Query Error',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'siswa_id' => 'required|exists:siswas,id',
                'job_order_id' => 'nullable|exists:job_orders,id', // NEW: Link to Job Order
                'kumiai_id' => 'nullable|exists:kumiais,id',
                'perusahaan_id' => 'nullable|exists:perusahaans,id',
                'program_id' => 'nullable|exists:programs,id',
                'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
                'posisi_kerja_id' => 'nullable|exists:posisi_kerjas,id',
                'lpk_mitra_id' => 'nullable|exists:lpk_mitras,id',
                'demografi_province_id' => 'nullable|exists:demografi_provinces,id',
                'demografi_regency_id' => 'nullable|exists:demografi_regencies,id',
                'lokasi' => 'nullable|string',
                'tanggal_mulai_kerja' => 'nullable|date',
                'tanggal_pulang_kerja' => 'nullable|date',
                'gaji' => 'nullable|numeric',
                'status_magang' => 'nullable|string',
                'avatar_url' => 'nullable|string',
            ]);

            // BUSINESS LOGIC: Prevent duplicate application for same Job Order
            if (!empty($validated['job_order_id'])) {
                $exists = SiswaMagang::where('siswa_id', $validated['siswa_id'])
                    ->where('job_order_id', $validated['job_order_id'])
                    ->exists();
                if ($exists) {
                    return response()->json(['message' => 'Siswa sudah melamar ke Job Order ini.'], 400);
                }
            }

            // BUSINESS LOGIC: Prevent "Multiverse Paradox" (One student active in two jobs)
            $newStatus = strtolower($validated['status_magang'] ?? '');
            $activeStatuses = ['aktif', 'diterima', 'active'];
            
            if (in_array($newStatus, $activeStatuses)) {
                $hasActiveJob = SiswaMagang::where('siswa_id', $validated['siswa_id'])
                    ->whereIn('status_magang', $activeStatuses)
                    ->exists();
                
                if ($hasActiveJob) {
                    return response()->json(['message' => 'Siswa sudah memiliki status Aktif di Job Order lain.'], 400);
                }
            }

            // TRANSACTION START
            $siswaMagang = \Illuminate\Support\Facades\DB::transaction(function () use ($validated) {
                // AUTOSYNC LOGIC: If job_order_id is provided, prioritize its data
                if (!empty($validated['job_order_id'])) {
                    $jobOrder = \App\Models\JobOrder::lockForUpdate()->find($validated['job_order_id']); // Lock row
                    
                    if (!$jobOrder) {
                        throw new \Exception('Job Order not found');
                    }

                    // 1. Quota Check
                    if ($jobOrder->kuota <= 0) {
                         throw new \Illuminate\Validation\ValidationException(\Illuminate\Validation\Validator::make([], []), 
                             response()->json(['message' => 'Kuota Job Order ini sudah habis!'], 400));
                    }

                    // 2. Data Consistency (Inherit from Job Order)
                    $validated['kumiai_id'] = $jobOrder->kumiai_id;
                    $validated['perusahaan_id'] = $jobOrder->perusahaan_id;
                    $validated['jenis_kerja_id'] = $jobOrder->jenis_kerja_id; 
                }
                
                $siswaMagang = SiswaMagang::create($validated);

                // 3. Decrement Quota (If Status is Accepted/Active)
                if (!empty($validated['job_order_id']) && 
                    in_array(strtolower($validated['status_magang'] ?? ''), ['aktif', 'diterima', 'active'])) {
                    
                    // Already have the object, but if strict transaction, use the locked one above if available
                    // For simplicity here, re-fetching or using the one in scope is fine as it's same transaction
                    if (isset($jobOrder)) {
                        $jobOrder->decrement('kuota');
                    }
                }
                
                return $siswaMagang;
            });
            // TRANSACTION END
            
            return response()->json($siswaMagang->load([
                'siswa', 'kumiai', 'perusahaan', 'program', 
                'jenis_kerja', 'posisi_kerja', 'lpk_mitra', 'job_order'
            ]), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error',
                'details' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $data = SiswaMagang::with([
                'siswa', 'kumiai', 'perusahaan', 'program', 
                'jenis_kerja', 'posisi_kerja', 'lpk_mitra',
                'demografi_province', 'demografi_regency'
            ])->findOrFail($id);
            
            // IDOR Check
            $user = $request->user();
            if ($user && $user->roles->contains('name', 'student')) {
                $ownerUserId = $data->siswa->user_id;
                // If user_id is null/different, deny. If same, allow.
                if ($ownerUserId != $user->id) {
                     return response()->json(['message' => 'Unauthorized Access'], 403);
                }
            }

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Not Found', 'details' => $e->getMessage()], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $siswaMagang = SiswaMagang::findOrFail($id);
            
            // SECURITY: IDOR & Field Restriction Check
            $user = $request->user();
            if ($user && $user->roles->contains('name', 'student')) {
                // 1. IDOR Check
                if ($siswaMagang->siswa->user_id !== $user->id) {
                    return response()->json(['message' => 'Unauthorized Access'], 403);
                }

                // 2. Field Restriction (Students cannot change status or job details)
                $forbiddenFields = ['status_magang', 'job_order_id', 'kumiai_id', 'perusahaan_id', 'gaji', 'program_id'];
                foreach ($forbiddenFields as $field) {
                    if ($request->has($field)) {
                        return response()->json(['message' => "Anda tidak memiliki akses untuk mengubah field: $field"], 403);
                    }
                }
            }

            $oldStatus = strtolower($siswaMagang->status_magang ?? '');
            $oldJobOrderId = $siswaMagang->job_order_id;
            
            $validated = $request->validate([
                'siswa_id' => 'sometimes|required|exists:siswas,id',
                'job_order_id' => 'nullable|exists:job_orders,id',
                'kumiai_id' => 'nullable|exists:kumiais,id',
                'perusahaan_id' => 'nullable|exists:perusahaans,id',
                'program_id' => 'nullable|exists:programs,id',
                'jenis_kerja_id' => 'nullable|exists:jenis_kerjas,id',
                'posisi_kerja_id' => 'nullable|exists:posisi_kerjas,id',
                'lpk_mitra_id' => 'nullable|exists:lpk_mitras,id',
                'demografi_province_id' => 'nullable|exists:demografi_provinces,id',
                'demografi_regency_id' => 'nullable|exists:demografi_regencies,id',
                'lokasi' => 'nullable|string',
                'tanggal_mulai_kerja' => 'nullable|date',
                'tanggal_pulang_kerja' => 'nullable|date',
                'gaji' => 'nullable|numeric',
                'status_magang' => 'nullable|string',
                'avatar_url' => 'nullable|string',
            ]);

            // Handling Status Change for Quota
            $newStatus = strtolower($validated['status_magang'] ?? $oldStatus);
            $activeStatuses = ['aktif', 'diterima', 'active'];
            $isOldActive = in_array($oldStatus, $activeStatuses);
            $isNewActive = in_array($newStatus, $activeStatuses);

            // BUSINESS LOGIC: Prevent Multiverse Paradox (Double Active)
            if ($isNewActive && !$isOldActive) {
                // Check if student has OTHER active jobs
                $currentSiswaId = $validated['siswa_id'] ?? $siswaMagang->siswa_id;
                $hasOtherActiveJob = SiswaMagang::where('siswa_id', $currentSiswaId)
                    ->where('id', '!=', $id) // Exclude self
                    ->whereIn('status_magang', $activeStatuses)
                    ->exists();

                if ($hasOtherActiveJob) {
                     return response()->json(['message' => 'Gagal: Siswa ini sedang Aktif di Job Order lain.'], 400);
                }
            }

            // TRANSACTION START
            $siswaMagang = \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $siswaMagang, $isOldActive, $isNewActive, $oldJobOrderId) {
                
                $newJobId = $validated['job_order_id'] ?? $oldJobOrderId;
                $jobChanged = ((string)$newJobId !== (string)$oldJobOrderId); // Strict comparison string safe

                // A. Restore Quota on Old Job IF:
                // 1. Status changed to Inactive (Active -> Inactive) OR
                // 2. Job changed while staying Active (Active -> Active (New Job))
                if (($isOldActive && !$isNewActive) || ($isOldActive && $isNewActive && $jobChanged)) {
                    if ($oldJobOrderId) {
                         \App\Models\JobOrder::where('id', $oldJobOrderId)->increment('kuota');
                    }
                }

                // B. Deduct Quota on New Job IF:
                // 1. Status changed to Active (Inactive -> Active) OR
                // 2. Job changed while staying Active (Active -> Active (New Job))
                if ((!$isOldActive && $isNewActive) || ($isOldActive && $isNewActive && $jobChanged)) {
                    if ($newJobId) {
                        $job = \App\Models\JobOrder::lockForUpdate()->find($newJobId);
                        
                        if (!$job) {
                             throw new \Exception('Job Order tidak ditemukan.');
                        }

                        if ($job->kuota > 0) {
                            $job->decrement('kuota');
                        } else {
                             throw new \Exception('Gagal: Kuota Job Order target sudah habis!');
                        }
                    }
                }
                
                $siswaMagang->update($validated);
                return $siswaMagang;
            });
            // TRANSACTION END
            
            return response()->json($siswaMagang->load([
                'siswa', 'kumiai', 'perusahaan', 'program', 
                'jenis_kerja', 'posisi_kerja', 'lpk_mitra', 'job_order'
            ]));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation Error', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $siswaMagang = SiswaMagang::find($id);
        if (!$siswaMagang) return response()->json(['message' => 'Not Found'], 404);

        // SECURITY CHECK
        $user = request()->user();
        $isStudent = $user->roles->contains('name', 'student');
        $status = strtolower($siswaMagang->status_magang ?? '');
        $protectedStatuses = ['wawancara', 'diterima', 'aktif', 'active', 'interview'];

        if ($isStudent && in_array($status, $protectedStatuses)) {
             return response()->json(['message' => 'Lamaran yang sedang diproses/diterima tidak dapat dibatalkan.'], 403);
        }

        // Restore Quota if active student is deleted
        $activeStatuses = ['aktif', 'diterima', 'active'];
        
        if (in_array($status, $activeStatuses) && $siswaMagang->job_order_id) {
             \App\Models\JobOrder::where('id', $siswaMagang->job_order_id)->increment('kuota');
        }

        $siswaMagang->delete();
        return response()->json(null, 204);
    }
}
