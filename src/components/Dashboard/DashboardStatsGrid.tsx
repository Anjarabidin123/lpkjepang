
import React from 'react';
import { StatsCard } from "@/components/StatsCard";
import { 
  Users, 
  GraduationCap,
  Briefcase
} from "lucide-react";

interface DashboardStatsGridProps {
  totalSiswa: number;
  totalSiswaMagang: number;
  totalJobOrder: number;
}

export function DashboardStatsGrid({
  totalSiswa,
  totalSiswaMagang,
  totalJobOrder
}: DashboardStatsGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Siswa"
        value={totalSiswa.toString()}
        icon={Users}
        trend={`${totalSiswa > 0 ? '+12% dari bulan lalu' : 'Belum ada data'}`}
        trendUp={true}
        className="bg-gradient-to-br from-blue-500 to-blue-600"
      />
      <StatsCard
        title="Total Siswa Magang"
        value={totalSiswaMagang.toString()}
        icon={GraduationCap}
        trend={`${totalSiswaMagang > 0 ? '+5% dari bulan lalu' : 'Belum ada data'}`}
        trendUp={true}
        className="bg-gradient-to-br from-emerald-500 to-emerald-600"
      />
      <StatsCard
        title="Total Job Order"
        value={totalJobOrder.toString()}
        icon={Briefcase}
        trend={`${totalJobOrder > 0 ? '+3 job order baru' : 'Belum ada data'}`}
        trendUp={true}
        className="bg-gradient-to-br from-purple-500 to-purple-600"
      />
    </div>
  );
}
