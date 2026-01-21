
import { DashboardCharts } from "@/components/DashboardCharts"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { useDashboardData } from "@/hooks/useDashboardData"
import { DashboardStatsGrid } from "@/components/Dashboard/DashboardStatsGrid"
import { DashboardLocationDistribution } from "@/components/Dashboard/DashboardLocationDistribution"
import { DashboardActivityFeed } from "@/components/Dashboard/DashboardActivityFeed"

export default function Dashboard() {
  const { jobOrders, siswa, programs, siswaMagang, kumiai, lpkMitra, perusahaan, isLoading } = useDashboardData();

  // Calculate stats from real data with proper fallbacks
  const totalSiswa = siswa?.length || 0;
  const totalSiswaMagang = siswaMagang?.length || 0;
  const totalLpkMitra = lpkMitra?.length || 0;
  const totalJobOrder = jobOrders?.length || 0;
  const totalKumiai = kumiai?.length || 0;
  const totalPerusahaan = perusahaan?.length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={48} text="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Main Stats Grid - 3 Cards Layout */}
      <DashboardStatsGrid
        totalSiswa={totalSiswa}
        totalSiswaMagang={totalSiswaMagang}
        totalJobOrder={totalJobOrder}
      />

      {/* Modern Charts Section */}
      <DashboardCharts 
        jobOrdersData={jobOrders}
        siswaData={siswa}
        programData={programs}
        siswaMagangData={siswaMagang as any}
      />

      {/* Location Distribution */}
      <DashboardLocationDistribution siswaMagang={siswaMagang as any} />

      {/* Activity Feed */}
      <DashboardActivityFeed 
        siswa={siswa}
        siswaMagang={siswaMagang as any}
        kumiai={kumiai}
      />
    </div>
  )
}
