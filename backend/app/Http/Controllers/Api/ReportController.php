<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiswaMagang;
use App\Models\Siswa;
use App\Models\JobOrder;
use App\Models\Invoice;
use App\Models\ArusKas;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Get report statistics
     */
    public function getStats(Request $request)
    {
        try {
            // Total reports generated (based on actual data queries)
            $totalReports = 0;
            
            // Count different types of reports available
            $siswaReports = Siswa::count() > 0 ? 1 : 0;
            $magangReports = SiswaMagang::count() > 0 ? 1 : 0;
            $jobOrderReports = JobOrder::count() > 0 ? 1 : 0;
            $invoiceReports = Invoice::count() > 0 ? 1 : 0;
            $arusKasReports = ArusKas::count() > 0 ? 1 : 0;
            
            $totalReports = $siswaReports + $magangReports + $jobOrderReports + $invoiceReports + $arusKasReports;

            // Calculate monthly growth (compare current month vs previous month)
            $currentMonth = now()->month;
            $previousMonth = now()->subMonth()->month;
            
            $currentMonthData = SiswaMagang::whereMonth('created_at', $currentMonth)->count();
            $previousMonthData = SiswaMagang::whereMonth('created_at', $previousMonth)->count();
            
            $monthlyGrowth = 0;
            if ($previousMonthData > 0) {
                $monthlyGrowth = (($currentMonthData - $previousMonthData) / $previousMonthData) * 100;
            }

            // Calculate accuracy rate (percentage of complete data)
            $totalSiswa = Siswa::count();
            $completeSiswa = Siswa::whereNotNull('nama')
                ->whereNotNull('nik')
                ->whereNotNull('email')
                ->count();
            
            $accuracyRate = $totalSiswa > 0 ? ($completeSiswa / $totalSiswa) * 100 : 0;

            return response()->json([
                'totalReports' => $totalReports,
                'monthlyGrowth' => round($monthlyGrowth, 1),
                'accuracyRate' => round($accuracyRate, 0),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch report stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available report types
     */
    public function getAvailableReports()
    {
        try {
            $reports = [
                [
                    'id' => 'siswa_progress',
                    'name' => 'Siswa Progress Report',
                    'description' => 'Laporan perkembangan siswa',
                    'available' => Siswa::count() > 0,
                    'count' => Siswa::count()
                ],
                [
                    'id' => 'financial',
                    'name' => 'Financial Report',
                    'description' => 'Laporan keuangan dan invoice',
                    'available' => Invoice::count() > 0 || ArusKas::count() > 0,
                    'count' => Invoice::count() + ArusKas::count()
                ],
                [
                    'id' => 'job_order',
                    'name' => 'Job Order Summary',
                    'description' => 'Ringkasan job order dan penempatan',
                    'available' => JobOrder::count() > 0,
                    'count' => JobOrder::count()
                ],
                [
                    'id' => 'magang',
                    'name' => 'Magang Report',
                    'description' => 'Laporan siswa magang aktif',
                    'available' => SiswaMagang::count() > 0,
                    'count' => SiswaMagang::count()
                ],
            ];

            return response()->json($reports);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch available reports',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent reports (last generated reports)
     */
    public function getRecentReports()
    {
        try {
            $recentReports = [];

            // Get latest siswa magang data as "report"
            $latestMagang = SiswaMagang::latest()->first();
            if ($latestMagang) {
                $recentReports[] = [
                    'id' => 'magang_' . $latestMagang->id,
                    'name' => 'Magang Summary',
                    'type' => 'Siswa Magang',
                    'generated_at' => $latestMagang->created_at->diffForHumans(),
                    'date' => $latestMagang->created_at->format('Y-m-d H:i:s')
                ];
            }

            // Get latest invoice as "report"
            $latestInvoice = Invoice::latest()->first();
            if ($latestInvoice) {
                $recentReports[] = [
                    'id' => 'invoice_' . $latestInvoice->id,
                    'name' => 'Financial Analytics',
                    'type' => 'Invoice',
                    'generated_at' => $latestInvoice->created_at->diffForHumans(),
                    'date' => $latestInvoice->created_at->format('Y-m-d H:i:s')
                ];
            }

            // Get latest job order as "report"
            $latestJobOrder = JobOrder::latest()->first();
            if ($latestJobOrder) {
                $recentReports[] = [
                    'id' => 'job_' . $latestJobOrder->id,
                    'name' => 'Job Order Report',
                    'type' => 'Job Order',
                    'generated_at' => $latestJobOrder->created_at->diffForHumans(),
                    'date' => $latestJobOrder->created_at->format('Y-m-d H:i:s')
                ];
            }

            return response()->json($recentReports);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch recent reports',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate specific report
     */
    public function generateReport(Request $request, $type)
    {
        try {
            switch ($type) {
                case 'siswa_progress':
                    return $this->generateSiswaProgressReport();
                case 'financial':
                    return $this->generateFinancialReport();
                case 'job_order':
                    return $this->generateJobOrderReport();
                case 'magang':
                    return $this->generateMagangReport();
                default:
                    return response()->json(['error' => 'Invalid report type'], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to generate report',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function generateSiswaProgressReport()
    {
        $data = Siswa::with(['program', 'lpkMitra'])
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        return response()->json([
            'type' => 'siswa_progress',
            'generated_at' => now(),
            'data' => $data
        ]);
    }

    private function generateFinancialReport()
    {
        // SECURITY: Separate Finance Access Check
        $user = auth()->user();
        $hasFinanceAccess = $user->hasPermission('finance_access') || $user->roles->contains('name', 'super_admin');
        
        if (!$hasFinanceAccess) {
             return response()->json(['error' => 'Unauthorized: Anda tidak memiliki akses laporan keuangan.'], 403);
        }

        $invoices = Invoice::sum('nominal');
        $pemasukan = ArusKas::where('jenis', 'Pemasukan')->sum('nominal');
        $pengeluaran = ArusKas::where('jenis', 'Pengeluaran')->sum('nominal');

        return response()->json([
            'type' => 'financial',
            'generated_at' => now(),
            'data' => [
                'total_invoices' => $invoices,
                'total_pemasukan' => $pemasukan,
                'total_pengeluaran' => $pengeluaran,
                'net_income' => $pemasukan - $pengeluaran
            ]
        ]);
    }

    private function generateJobOrderReport()
    {
        $data = JobOrder::with(['kumiai', 'jenisKerja'])
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get();

        return response()->json([
            'type' => 'job_order',
            'generated_at' => now(),
            'data' => $data
        ]);
    }

    private function generateMagangReport()
    {
        $data = SiswaMagang::with(['siswa', 'kumiai', 'perusahaan'])
            ->select('status_magang', DB::raw('count(*) as total'))
            ->groupBy('status_magang')
            ->get();

        return response()->json([
            'type' => 'magang',
            'generated_at' => now(),
            'data' => $data
        ]);
    }
}
