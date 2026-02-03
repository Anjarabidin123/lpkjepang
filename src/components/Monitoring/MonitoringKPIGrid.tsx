
import React from 'react';
import { MonitoringKPICard } from './MonitoringKPICard';
import { Users, Building, GraduationCap, DollarSign } from 'lucide-react';

interface MonitoringKPIGridProps {
  data?: {
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
  };
}

export function MonitoringKPIGrid({ data }: MonitoringKPIGridProps) {
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
      return 'Rp 0';
    }

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value).replace('IDR', 'Rp');
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `Rp ${value.toLocaleString('en-US')}`;
    }
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }

    try {
      return value.toLocaleString('en-US');
    } catch (error) {
      console.error('Error formatting number:', error);
      return value.toString();
    }
  };

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 sm:h-40 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  // Safe data extraction with fallbacks
  const safeData = {
    siswaMagangKPI: data.siswaMagangKPI || { target: 0, pencapaian: 0, pertumbuhan: 0, trend: 'stable' as const },
    kumiaiKPI: data.kumiaiKPI || { target: 0, pencapaian: 0, pertumbuhan: 0, trend: 'stable' as const },
    lpkMitraKPI: data.lpkMitraKPI || { target: 0, pencapaian: 0, pertumbuhan: 0, trend: 'stable' as const },
    gajiKPI: data.gajiKPI || { target: 0, pencapaian: 0, pertumbuhan: 0, trend: 'stable' as const },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <MonitoringKPICard
        title="Siswa Magang"
        target={safeData.siswaMagangKPI.target}
        pencapaian={safeData.siswaMagangKPI.pencapaian}
        pertumbuhan={safeData.siswaMagangKPI.pertumbuhan}
        trend={safeData.siswaMagangKPI.trend}
        icon={GraduationCap}
        formatValue={formatNumber}
        className="border-l-4 border-l-blue-500"
      />

      <MonitoringKPICard
        title="Kumiai Aktif"
        target={safeData.kumiaiKPI.target}
        pencapaian={safeData.kumiaiKPI.pencapaian}
        pertumbuhan={safeData.kumiaiKPI.pertumbuhan}
        trend={safeData.kumiaiKPI.trend}
        icon={Building}
        formatValue={formatNumber}
        className="border-l-4 border-l-green-500"
      />

      <MonitoringKPICard
        title="LPK Mitra"
        target={safeData.lpkMitraKPI.target}
        pencapaian={safeData.lpkMitraKPI.pencapaian}
        pertumbuhan={safeData.lpkMitraKPI.pertumbuhan}
        trend={safeData.lpkMitraKPI.trend}
        icon={Users}
        formatValue={formatNumber}
        className="border-l-4 border-l-purple-500"
      />

      <MonitoringKPICard
        title="Rata-rata Gaji"
        target={safeData.gajiKPI.target}
        pencapaian={safeData.gajiKPI.pencapaian}
        pertumbuhan={safeData.gajiKPI.pertumbuhan}
        trend={safeData.gajiKPI.trend}
        icon={DollarSign}
        formatValue={formatCurrency}
        className="border-l-4 border-l-orange-500"
      />
    </div>
  );
}
