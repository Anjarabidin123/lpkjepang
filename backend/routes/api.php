<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controller Imports
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DemografiController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\SiswaController;
use App\Http\Controllers\Api\SiswaMagangController;
use App\Http\Controllers\Api\JobOrderController;
use App\Http\Controllers\Api\JobOrderPesertaController;
use App\Http\Controllers\Api\SiswaDocumentController;
use App\Http\Controllers\Api\SiswaKeluargaIndonesiaController;
use App\Http\Controllers\Api\SiswaKeluargaJepangController;
use App\Http\Controllers\Api\SiswaKontakKeluargaController;
use App\Http\Controllers\Api\SiswaPengalamanKerjaController;
use App\Http\Controllers\Api\SiswaPendidikanController;
use App\Http\Controllers\Api\ArusKasController;
use App\Http\Controllers\Api\KategoriPemasukanController;
use App\Http\Controllers\Api\PemasukanController;
use App\Http\Controllers\Api\KategoriPengeluaranController;
use App\Http\Controllers\Api\PengeluaranController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\InvoiceItemController;
use App\Http\Controllers\Api\ItemPembayaranController;
use App\Http\Controllers\Api\InternalPaymentController;
use App\Http\Controllers\Api\KewajibanPembayaranController;
use App\Http\Controllers\Api\KumiaiController;
use App\Http\Controllers\Api\LpkMitraController;
use App\Http\Controllers\Api\PerusahaanController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\JenisKerjaController;
use App\Http\Controllers\Api\PosisiKerjaController;
use App\Http\Controllers\Api\MonitoringController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\RecruitmentController;
use App\Http\Controllers\Api\DocumentTrackingController;
use App\Http\Controllers\Api\StudentAttendanceController;
use App\Http\Controllers\Api\StudentGradeController;
use App\Http\Controllers\Api\LearningModuleController;
use App\Http\Controllers\ClassScheduleController;
use App\Http\Controllers\Api\ProfilLpkController;

Route::get('/health', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbStatus = 'Connected';
    } catch (\Exception $e) {
        $dbStatus = 'Error: ' . $e->getMessage();
    }

    return response()->json([
        'status' => 'ok',
        'database' => $dbStatus,
        'timestamp' => now()
    ]);
});

// ============================================
// PUBLIC ROUTES (No Auth Required)
// ============================================
Route::post('/login', [AuthController::class, 'login']);
Route::get('/demografi/provinces', [DemografiController::class, 'getProvinces']);
Route::get('/demografi/regencies', [DemografiController::class, 'getRegencies']);

// ============================================
// AUTHENTICATED ROUTES (Auth Required)
// ============================================
Route::middleware('auth:sanctum')->group(function () {
    
    // User Profile & Auth
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['roles', 'siswa']);
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);
    Route::put('/user/profile', [ProfileController::class, 'update']);

    // ============================================
    // ADMIN ONLY ROUTES
    // ============================================
    Route::middleware('role:admin')->group(function () {
        // User Management
        Route::apiResource('users', UserController::class);
        
        // Role & Permission Management
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('permissions', PermissionController::class);
    });

    // ============================================
    // ADMIN & REKRUTMENT ROUTES
    // ============================================
    Route::middleware('role:admin,instructor,super_admin')->group(function () {
        // Siswa Management
        Route::apiResource('siswa', SiswaController::class);
        Route::apiResource('siswa-magang', SiswaMagangController::class);
        
        // Job Order Management
        Route::apiResource('job-orders', JobOrderController::class);
        Route::apiResource('job-order-peserta', JobOrderPesertaController::class);
        
        // Siswa Related Data
        Route::apiResource('siswa-documents', SiswaDocumentController::class);
        Route::apiResource('siswa-keluarga-indonesia', SiswaKeluargaIndonesiaController::class);
        Route::apiResource('siswa-keluarga-jepang', SiswaKeluargaJepangController::class);
        Route::apiResource('siswa-kontak-keluarga', SiswaKontakKeluargaController::class);
        Route::apiResource('siswa-pengalaman-kerja', SiswaPengalamanKerjaController::class);
        Route::apiResource('siswa-pendidikan', SiswaPendidikanController::class);
    });

    // ============================================
    // ADMIN & KEUANGAN ROUTES
    // ============================================
    Route::middleware('role:admin,finance,super_admin')->group(function () {
        // Financial Management
        Route::apiResource('arus-kas', ArusKasController::class);
        Route::apiResource('kategori-pemasukan', KategoriPemasukanController::class);
        Route::apiResource('pemasukan', PemasukanController::class);
        Route::apiResource('kategori-pengeluaran', KategoriPengeluaranController::class);
        Route::apiResource('pengeluaran', PengeluaranController::class);
        Route::apiResource('invoices', InvoiceController::class);
        Route::apiResource('invoice-items', InvoiceItemController::class);
        Route::apiResource('kewajiban-pembayaran', KewajibanPembayaranController::class);
        Route::apiResource('item-pembayaran', ItemPembayaranController::class);
        Route::apiResource('internal-payments', InternalPaymentController::class);
    });

    // ============================================
    // SHARED ROUTES (All Authenticated Users)
    // ============================================
    // Master Data (Read for all, Write for admin/rekrutment)
    Route::apiResource('kumiai', KumiaiController::class);
    Route::apiResource('lpk-mitra', LpkMitraController::class);
    Route::apiResource('perusahaan', PerusahaanController::class);
    Route::apiResource('programs', ProgramController::class);
    Route::apiResource('jenis-kerja', JenisKerjaController::class);
    Route::apiResource('posisi-kerja', PosisiKerjaController::class);
    Route::apiResource('profil-lpk', ProfilLpkController::class);
    
    // Monitoring KPI (All authenticated users can view)
    Route::get('/monitoring/kpi', [MonitoringController::class, 'getKPIData']);
    
    // Reports (All authenticated users can view)
    Route::get('/reports/stats', [ReportController::class, 'getStats']);
    Route::get('/reports/available', [ReportController::class, 'getAvailableReports']);
    Route::get('/reports/recent', [ReportController::class, 'getRecentReports']);
    Route::post('/reports/generate/{type}', [ReportController::class, 'generateReport']);
    
    // Tasks (All authenticated users can manage)
    Route::get('/tasks/stats', [TaskController::class, 'getStats']);
    Route::apiResource('tasks', TaskController::class);
    
    // Recruitment (All authenticated users can manage)
    Route::get('/recruitment/stats', [RecruitmentController::class, 'getStats']);
    Route::apiResource('recruitment', RecruitmentController::class);

    // Document Tracking
    Route::get('/document-tracking/stats', [DocumentTrackingController::class, 'getStats']);
    Route::apiResource('document-tracking', DocumentTrackingController::class);

    // Education (Attendance & Grades)
    Route::post('/education/bulk-attendance', [StudentAttendanceController::class, 'bulkStore']);
    Route::apiResource('/education/attendance', StudentAttendanceController::class);
    Route::apiResource('/education/grades', StudentGradeController::class);
    Route::apiResource('/education/schedules', ClassScheduleController::class);
    Route::apiResource('/learning-modules', LearningModuleController::class);
});
