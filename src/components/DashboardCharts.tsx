
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Target, Award } from "lucide-react";

interface DashboardChartsProps {
  jobOrdersData?: any[];
  siswaData?: any[];
  programData?: any[];
  siswaMagangData?: any[];
}

export function DashboardCharts({ 
  jobOrdersData = [], 
  siswaData = [], 
  programData = [], 
  siswaMagangData = [] 
}: DashboardChartsProps) {
  // Process real data for charts with fallback to demo data
  const monthlyTargetData = React.useMemo(() => {
    if (jobOrdersData.length > 0) {
      // Group job orders by month
      const monthlyData = jobOrdersData.reduce((acc, job) => {
        const month = new Date(job.created_at).toLocaleDateString('id-ID', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(monthlyData).map(([month, count], index) => ({
        month,
        target: (index + 1) * 5 + 20,
        achievement: count as number,
        trend: Math.max(0, (count as number) - 2)
      }));
    }
    
    // Fallback demo data
    return [
      { month: 'Jan', target: 25, achievement: 18, trend: 15 },
      { month: 'Feb', target: 30, achievement: 22, trend: 18 },
      { month: 'Mar', target: 35, achievement: 28, trend: 22 },
      { month: 'Apr', target: 40, achievement: 32, trend: 28 },
      { month: 'May', target: 45, achievement: 38, trend: 32 },
      { month: 'Jun', target: 50, achievement: 42, trend: 38 }
    ];
  }, [jobOrdersData]);

  const statusDistribution = React.useMemo(() => {
    if (siswaData.length > 0) {
      const statusCounts = siswaData.reduce((acc, siswa) => {
        const status = siswa.status || 'Tidak Diketahui';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const colors = {
        'Aktif': '#10b981',
        'Proses': '#f59e0b',
        'Menunggu': '#6b7280',
        'Tidak Diketahui': '#9ca3af'
      };

      return Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value: value as number,
        color: colors[name as keyof typeof colors] || '#9ca3af'
      }));
    }

    // Fallback demo data
    return [
      { name: 'Aktif', value: 186, color: '#10b981' },
      { name: 'Proses', value: 42, color: '#f59e0b' },
      { name: 'Menunggu', value: 20, color: '#6b7280' }
    ];
  }, [siswaData]);

  const trendData = React.useMemo(() => {
    if (siswaMagangData.length > 0) {
      // Group siswa magang by month
      const monthlyMagang = siswaMagangData.reduce((acc, magang) => {
        const month = new Date(magang.created_at).toLocaleDateString('id-ID', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const monthlyPendaftar = siswaData.reduce((acc, siswa) => {
        const month = new Date(siswa.created_at).toLocaleDateString('id-ID', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const months = [...new Set([...Object.keys(monthlyMagang), ...Object.keys(monthlyPendaftar)])];
      
      return months.map(month => ({
        month,
        penempatan: monthlyMagang[month] || 0,
        pendaftar: monthlyPendaftar[month] || 0
      }));
    }

    // Fallback demo data
    return [
      { month: 'Jan', penempatan: 15, pendaftar: 28 },
      { month: 'Feb', penempatan: 18, pendaftar: 32 },
      { month: 'Mar', penempatan: 22, pendaftar: 35 },
      { month: 'Apr', penempatan: 28, pendaftar: 40 },
      { month: 'May', penempatan: 32, pendaftar: 38 },
      { month: 'Jun', penempatan: 38, pendaftar: 45 }
    ];
  }, [siswaMagangData, siswaData]);

  const chartConfig = {
    target: {
      label: "Target",
      color: "#3b82f6",
    },
    achievement: {
      label: "Pencapaian",
      color: "#10b981",
    },
    trend: {
      label: "Trend",
      color: "#f59e0b",
    },
    penempatan: {
      label: "Penempatan",
      color: "#8b5cf6",
    },
    pendaftar: {
      label: "Pendaftar",
      color: "#06b6d4",
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Mobile: Single column, Desktop: Two columns */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Target vs Achievement Chart */}
        <div className="animate-fade-in w-full">
          <div className="flat-card w-full">
            <div className="p-6 border-b border-border">
              <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
                <div className="flat-icon-container bg-primary/10">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm sm:text-base">Target vs Pencapaian</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="w-full overflow-hidden">
                <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={monthlyTargetData} 
                      margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 9 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        interval={0}
                      />
                      <YAxis 
                        tick={{ fontSize: 9 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        width={30}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="target" 
                        fill="var(--color-target)" 
                        radius={[2, 2, 0, 0]}
                        name="Target"
                      />
                      <Bar 
                        dataKey="achievement" 
                        fill="var(--color-achievement)" 
                        radius={[2, 2, 0, 0]}
                        name="Pencapaian"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="animate-fade-in w-full" style={{ animationDelay: '0.1s' }}>
          <div className="flat-card w-full">
            <div className="p-6 border-b border-border">
              <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
                <div className="flat-icon-container bg-green-500/10">
                  <Award className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm sm:text-base">Status Siswa</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="w-full overflow-hidden">
                <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="flex justify-center gap-1 sm:gap-2 mt-3 sm:mt-4 flex-wrap">
                {statusDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Line Chart - Full Width */}
      <div className="mt-4 animate-fade-in w-full" style={{ animationDelay: '0.2s' }}>
        <div className="flat-card w-full">
          <div className="p-6 border-b border-border">
            <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground">
              <div className="flat-icon-container bg-purple-500/10">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm sm:text-base">Trend Bulanan</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="w-full overflow-hidden">
              <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={trendData} 
                    margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 9 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      interval={0}
                    />
                    <YAxis 
                      tick={{ fontSize: 9 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      width={30}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="penempatan" 
                      stroke="var(--color-penempatan)" 
                      strokeWidth={2}
                      dot={{ r: 3, fill: "var(--color-penempatan)" }}
                      name="Penempatan"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pendaftar" 
                      stroke="var(--color-pendaftar)" 
                      strokeWidth={2}
                      dot={{ r: 3, fill: "var(--color-pendaftar)" }}
                      name="Pendaftar"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
