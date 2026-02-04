<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SiswaMagang;
use App\Models\Kumiai;
use App\Models\LpkMitra;
use App\Models\Siswa;
use Illuminate\Support\Facades\DB;

class MonitoringController extends Controller
{
    /**
     * Get KPI monitoring data with real statistics
     */
    public function getKPIData(Request $request)
    {
        try {
            // Get filter parameters
            $kumiaiId = $request->query('kumiai_id');
            $lpkMitraId = $request->query('lpk_mitra_id');
            $status = $request->query('status');
            $period = $request->query('period', 'monthly'); // monthly, quarterly, yearly

            // Base queries
            $siswaMagangQuery = SiswaMagang::query();
            $siswaQuery = Siswa::query();

            // Apply filters
            if ($kumiaiId && $kumiaiId !== 'all') {
                $siswaMagangQuery->where('kumiai_id', $kumiaiId);
            }
            if ($lpkMitraId && $lpkMitraId !== 'all') {
                $siswaMagangQuery->where('lpk_mitra_id', $lpkMitraId);
            }
            if ($status && $status !== 'all') {
                $siswaMagangQuery->where('status_magang', $status);
            }

            // Get counts
            $totalSiswaMagang = $siswaMagangQuery->count();
            $totalKumiai = Kumiai::count();
            $totalLpkMitra = LpkMitra::count();
            $totalSiswa = $siswaQuery->count();

            // Calculate growth (compare with previous period)
            $previousPeriodStart = $this->getPreviousPeriodStart($period);
            $currentPeriodStart = $this->getCurrentPeriodStart($period);

            $previousCount = SiswaMagang::where('created_at', '>=', $previousPeriodStart)
                ->where('created_at', '<', $currentPeriodStart)
                ->count();
            
            $currentCount = SiswaMagang::where('created_at', '>=', $currentPeriodStart)
                ->count();

            $siswaMagangGrowth = $previousCount > 0 
                ? round((($currentCount - $previousCount) / $previousCount) * 100, 1)
                : 0;

            // Get chart data (last 12 periods)
            $chartData = $this->getChartData($period, $siswaMagangQuery);

            // Get trend data
            $trendData = $this->getTrendData($period);

            // Get table data (recent siswa magang with stats)
            $tableData = $this->getTableData($siswaMagangQuery);


            return response()->json([
                'siswaMagangKPI' => [
                    'target' => 100,
                    'pencapaian' => $totalSiswaMagang,
                    'pertumbuhan' => $siswaMagangGrowth,
                    'trend' => $siswaMagangGrowth > 0 ? 'up' : ($siswaMagangGrowth < 0 ? 'down' : 'stable')
                ],
                'kumiaiKPI' => [
                    'target' => 50,
                    'pencapaian' => $totalKumiai,
                    'pertumbuhan' => 0, // Could calculate if needed
                    'trend' => 'stable'
                ],
                'lpkMitraKPI' => [
                    'target' => 20,
                    'pencapaian' => $totalLpkMitra,
                    'pertumbuhan' => 0,
                    'trend' => 'stable'
                ],
                'gajiKPI' => [
                    'target' => 150000,
                    'pencapaian' => round(\App\Models\SiswaMagang::avg('gaji') ?? 0),
                    'pertumbuhan' => 0,
                    'trend' => 'stable'
                ],
                'chartData' => $chartData,
                'trendData' => $trendData,
                'tableData' => $tableData,
                'summary' => [
                    'totalSiswa' => $totalSiswa,
                    'totalSiswaMagang' => $totalSiswaMagang,
                    'totalKumiai' => $totalKumiai,
                    'totalLpkMitra' => $totalLpkMitra,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch monitoring data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get chart data for the specified period
     */
    private function getChartData($period, $query)
    {
        $periods = $this->getPeriods($period, 12);
        $data = [];

        foreach ($periods as $periodInfo) {
            $count = (clone $query)
                ->whereBetween('created_at', [$periodInfo['start'], $periodInfo['end']])
                ->count();

            $data[] = [
                'period' => $periodInfo['label'],
                'siswaMagang' => $count,
                'target' => 100,
                'pencapaian' => min($count, 100)
            ];
        }

        return $data;
    }

    /**
     * Get trend data
     */
    private function getTrendData($period)
    {
        $periods = $this->getPeriods($period, 12);
        $data = [];

        foreach ($periods as $periodInfo) {
            $count = SiswaMagang::whereBetween('created_at', [$periodInfo['start'], $periodInfo['end']])
                ->count();

            $data[] = [
                'period' => $periodInfo['label'],
                'value' => $count,
                'category' => 'Siswa Magang'
            ];
        }

        return $data;
    }

    /**
     * Get table data with statistics
     */
    private function getTableData($query)
    {
        $siswaMagang = (clone $query)
            ->with('siswa')
            ->latest()
            ->limit(10)
            ->get();

        return $siswaMagang->map(function ($sm, $index) {
            $target = 100;
            $pencapaian = $sm->status_magang === 'aktif' ? 75 : ($sm->status_magang === 'selesai' ? 100 : 25);
            
            return [
                'id' => $sm->id,
                'nama' => $sm->siswa->nama ?? 'Unknown',
                'kategori' => 'Siswa Magang',
                'status' => $sm->status_magang ?? 'pending',
                'target' => $target,
                'pencapaian' => $pencapaian,
                'persentase' => $pencapaian,
                'trend' => $pencapaian >= 75 ? 'up' : 'down'
            ];
        })->toArray();
    }

    /**
     * Get periods for chart/trend
     */
    private function getPeriods($period, $count)
    {
        $periods = [];
        $now = now();

        for ($i = $count - 1; $i >= 0; $i--) {
            switch ($period) {
                case 'monthly':
                    $start = $now->copy()->subMonths($i)->startOfMonth();
                    $end = $now->copy()->subMonths($i)->endOfMonth();
                    $label = $start->format('M Y');
                    break;
                case 'quarterly':
                    $start = $now->copy()->subQuarters($i)->startOfQuarter();
                    $end = $now->copy()->subQuarters($i)->endOfQuarter();
                    $label = 'Q' . $start->quarter . ' ' . $start->year;
                    break;
                case 'yearly':
                    $start = $now->copy()->subYears($i)->startOfYear();
                    $end = $now->copy()->subYears($i)->endOfYear();
                    $label = $start->format('Y');
                    break;
                default:
                    $start = $now->copy()->subMonths($i)->startOfMonth();
                    $end = $now->copy()->subMonths($i)->endOfMonth();
                    $label = $start->format('M Y');
            }

            $periods[] = [
                'start' => $start,
                'end' => $end,
                'label' => $label
            ];
        }

        return $periods;
    }

    /**
     * Get previous period start date
     */
    private function getPreviousPeriodStart($period)
    {
        switch ($period) {
            case 'monthly':
                return now()->subMonths(2)->startOfMonth();
            case 'quarterly':
                return now()->subQuarters(2)->startOfQuarter();
            case 'yearly':
                return now()->subYears(2)->startOfYear();
            default:
                return now()->subMonths(2)->startOfMonth();
        }
    }

    /**
     * Get current period start date
     */
    private function getCurrentPeriodStart($period)
    {
        switch ($period) {
            case 'monthly':
                return now()->subMonth()->startOfMonth();
            case 'quarterly':
                return now()->subQuarter()->startOfQuarter();
            case 'yearly':
                return now()->subYear()->startOfYear();
            default:
                return now()->subMonth()->startOfMonth();
        }
    }
}
