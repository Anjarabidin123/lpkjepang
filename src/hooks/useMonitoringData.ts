import { useQuery } from '@tanstack/react-query';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export interface MonitoringKPIData {
  siswaMagangKPI: {
    target: number;
    pencapaian: number;
    pertumbuhan: number;
    trend: 'up' | 'down' | 'stable';
  };
  kumiaiKPI: {
    target: number;
    pencapaian: number;
    pertumbuhan: number;
    trend: 'up' | 'down' | 'stable';
  };
  lpkMitraKPI: {
    target: number;
    pencapaian: number;
    pertumbuhan: number;
    trend: 'up' | 'down' | 'stable';
  };
  gajiKPI: {
    target: number;
    pencapaian: number;
    pertumbuhan: number;
    trend: 'up' | 'down' | 'stable';
  };
  chartData: Array<{
    period: string;
    siswaMagang: number;
    target: number;
    pencapaian: number;
  }>;
  trendData: Array<{
    period: string;
    value: number;
    category: string;
  }>;
  tableData: Array<{
    id: number;
    nama: string;
    kategori: string;
    status: string;
    target: number;
    pencapaian: number;
    persentase: number;
    trend: 'up' | 'down';
  }>;
  summary: {
    totalSiswa: number;
    totalSiswaMagang: number;
    totalKumiai: number;
    totalLpkMitra: number;
  };
}

export function useMonitoringData(filters?: {
  kumiai_id?: string;
  lpk_mitra_id?: string;
  status?: string;
  period?: string;
}) {
  return useQuery<MonitoringKPIData>({
    queryKey: ['monitoring-kpi', filters],
    queryFn: async () => {
      try {
        console.log('Fetching monitoring KPI data from Laravel API...');

        // Build query params
        const params = new URLSearchParams();
        if (filters?.kumiai_id && filters.kumiai_id !== 'all') {
          params.append('kumiai_id', filters.kumiai_id);
        }
        if (filters?.lpk_mitra_id && filters.lpk_mitra_id !== 'all') {
          params.append('lpk_mitra_id', filters.lpk_mitra_id);
        }
        if (filters?.status && filters.status !== 'all') {
          params.append('status', filters.status);
        }
        if (filters?.period) {
          params.append('period', filters.period);
        }

        const url = `${endpoints.monitoring.kpi}${params.toString() ? '?' + params.toString() : ''}`;
        const response = await authFetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch monitoring KPI data');
        }

        const data = await response.json();
        console.log('Monitoring KPI data fetched successfully:', data);

        return data;
      } catch (error) {
        console.error('Error in monitoring KPI query:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes (refresh more often for KPI)
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      console.log('Monitoring KPI query retry attempt:', failureCount, error);
      return failureCount < 3;
    }
  });
}
