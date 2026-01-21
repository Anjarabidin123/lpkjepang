
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor } from 'lucide-react';
import { MonitoringKPIGrid } from '@/components/Monitoring/MonitoringKPIGrid';
import { MonitoringCharts } from '@/components/Monitoring/MonitoringCharts';
import { MonitoringFilters } from '@/components/Monitoring/MonitoringFilters';
import { MonitoringTable } from '@/components/Monitoring/MonitoringTable';
import { useMonitoringData } from '@/hooks/useMonitoringData';
import { useKumiai } from '@/hooks/useKumiai';
import { useLpkMitra } from '@/hooks/useLpkMitra';
import { AuthGuard } from '@/components/AuthGuard';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Create mock KPI data structure to match expected interface
const createMockKPIData = (data: any) => {
  // Safe data processing with null checks
  const safeData = data || {};
  
  return {
    siswaMagangKPI: {
      target: 100,
      pencapaian: safeData.totalSiswaMagang || 0,
      pertumbuhan: 5.2,
      trend: 'up' as const
    },
    kumiaiKPI: {
      target: 50,
      pencapaian: safeData.totalKumiai || 0,
      pertumbuhan: 2.1,
      trend: 'up' as const
    },
    lpkMitraKPI: {
      target: 20,
      pencapaian: safeData.totalLpkMitra || 0,
      pertumbuhan: 1.5,
      trend: 'stable' as const
    },
    gajiKPI: {
      target: 150000,
      pencapaian: 135000,
      pertumbuhan: -2.3,
      trend: 'down' as const
    },
    chartData: safeData.siswa?.slice(0, 12).map((item: any, index: number) => ({
      period: `Periode ${index + 1}`,
      siswaMagang: Math.floor(Math.random() * 50) + 10,
      target: 100,
      pencapaian: Math.floor(Math.random() * 80) + 20
    })) || Array.from({ length: 12 }, (_, index) => ({
      period: `Periode ${index + 1}`,
      siswaMagang: Math.floor(Math.random() * 50) + 10,
      target: 100,
      pencapaian: Math.floor(Math.random() * 80) + 20
    })),
    trendData: safeData.siswaMagang?.slice(0, 12).map((item: any, index: number) => ({
      period: `Bulan ${index + 1}`,
      value: Math.floor(Math.random() * 30) + 5,
      category: 'Siswa Magang'
    })) || Array.from({ length: 12 }, (_, index) => ({
      period: `Bulan ${index + 1}`,
      value: Math.floor(Math.random() * 30) + 5,
      category: 'Siswa Magang'
    })),
    tableData: safeData.siswa?.slice(0, 10).map((item: any, index: number) => ({
      id: item.id || `mock-${index}`,
      nama: item.nama || `Data ${index + 1}`,
      kategori: 'Siswa',
      status: item.status || 'Aktif',
      target: 100,
      pencapaian: Math.floor(Math.random() * 100),
      persentase: Math.floor(Math.random() * 100),
      trend: Math.random() > 0.5 ? 'up' : 'down'
    })) || []
  };
};

export default function Monitoring() {
  const [selectedKumiai, setSelectedKumiai] = useState('all');
  const [selectedLpkMitra, setSelectedLpkMitra] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const { 
    data: monitoringData, 
    isLoading: isLoadingMonitoring, 
    error: monitoringError,
    refetch: refetchMonitoring 
  } = useMonitoringData();

  const { kumiai = [], isLoading: isLoadingKumiai } = useKumiai();
  const { lpkMitras = [], isLoading: isLoadingLpkMitra } = useLpkMitra();

  const handleRefresh = () => {
    console.log('Refreshing monitoring data...');
    refetchMonitoring();
  };

  const isLoading = isLoadingMonitoring || isLoadingKumiai || isLoadingLpkMitra;

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="container-responsive py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 text-sm">Loading monitoring data...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (monitoringError) {
    console.error('Monitoring error:', monitoringError);
    return (
      <AuthGuard>
        <div className="container-responsive py-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4 text-sm">
              {monitoringError?.message || 'Failed to load monitoring data'}
            </p>
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Transform data to match expected interface with safe processing
  const transformedData = createMockKPIData(monitoringData);

  return (
    <AuthGuard>
      <div className="container-responsive py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Monitor className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">KPI Monitoring Dashboard</h1>
            <p className="text-gray-600 text-sm">Monitor key performance indicators dan aktivitas sistem</p>
          </div>
        </div>
        
        {/* Filters */}
        <ErrorBoundary>
          <MonitoringFilters
            selectedKumiai={selectedKumiai}
            selectedLpkMitra={selectedLpkMitra}
            selectedStatus={selectedStatus}
            selectedPeriod={selectedPeriod}
            onKumiaiChange={setSelectedKumiai}
            onLpkMitraChange={setSelectedLpkMitra}
            onStatusChange={setSelectedStatus}
            onPeriodChange={setSelectedPeriod}
            onRefresh={handleRefresh}
            kumiaiOptions={kumiai}
            lpkMitraOptions={lpkMitras}
          />
        </ErrorBoundary>

        {/* KPI Grid */}
        <ErrorBoundary>
          <MonitoringKPIGrid data={transformedData} />
        </ErrorBoundary>

        {/* Charts */}
        <ErrorBoundary>
          <MonitoringCharts 
            chartData={transformedData.chartData}
            trendData={transformedData.trendData}
            period={selectedPeriod}
          />
        </ErrorBoundary>

        {/* Data Table */}
        <ErrorBoundary>
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Detailed Performance Data</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <MonitoringTable 
                data={transformedData.tableData}
                filters={{
                  kumiai: selectedKumiai,
                  lpkMitra: selectedLpkMitra,
                  status: selectedStatus,
                  period: selectedPeriod
                }}
              />
            </CardContent>
          </Card>
        </ErrorBoundary>
      </div>
    </AuthGuard>
  );
}
