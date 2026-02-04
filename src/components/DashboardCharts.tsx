
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Tooltip } from "recharts";
import { TrendingUp, Target, Award, PieChart as PieIcon, Activity } from "lucide-react";

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
  console.log('DashboardCharts received props:', {
    jobOrdersCount: jobOrdersData.length,
    siswaCount: siswaData.length,
    programCount: programData.length,
    siswaMagangCount: siswaMagangData.length
  });


  const monthlyTargetData = React.useMemo(() => {
    let result: any[] = [];
    if (jobOrdersData.length > 0) {
      const monthlyData = jobOrdersData.reduce((acc, job) => {
        const month = new Date(job.created_at).toLocaleDateString('id-ID', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      result = Object.entries(monthlyData).map(([month, count], index) => ({
        month,
        target: (index + 1) * 3 + 10,
        achievement: count as number,
      }));
    }
    console.log('monthlyTargetData calculated:', result.length, result);
    return result;
  }, [jobOrdersData]);

  const statusDistribution = React.useMemo(() => {
    let result: any[] = [];
    if (siswaData.length > 0) {
      const statusCounts = siswaData.reduce((acc, siswa) => {
        const status = siswa.status || 'Lainnya';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const colors = {
        'Aktif': '#3b82f6',
        'Lulus': '#10b981',
        'Proses': '#f59e0b',
        'Lainnya': '#94a3b8'
      };

      result = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value: value as number,
        color: colors[name as keyof typeof colors] || '#94a3b8'
      }));
    }
    console.log('statusDistribution calculated:', result.length, result);
    return result;
  }, [siswaData]);


  const chartConfig = {
    target: { label: "Target", color: "#6366f1" },
    achievement: { label: "Realisasi", color: "#10b981" },
    siswaMagang: { label: "Siswa", color: "#3b82f6" }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Target vs Achievement */}
      <Card className="flat-card overflow-hidden">
        <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-50">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-500">
            <Target className="w-4 h-4 text-primary" />
            Vektor Pertumbuhan Job Order
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-10 h-[350px]">
          {monthlyTargetData.length === 0 ? (
            <EmptyState icon={Target} label="Data Job Order Kosong" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTargetData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="target" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Target" />
                <Bar dataKey="achievement" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Realisasi" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart Status */}
      <Card className="flat-card overflow-hidden">
        <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-50">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-500">
            <PieIcon className="w-4 h-4 text-emerald-500" />
            Distribusi Status Siswa
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-10 h-[350px] flex flex-col items-center">
          {statusDistribution.length === 0 ? (
            <EmptyState icon={Activity} label="Data Siswa Kosong" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {statusDistribution.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-300">
      <Icon className="w-12 h-12 mb-4 opacity-20" />
      <p className="text-xs font-black uppercase tracking-widest">{label}</p>
    </div>
  );
}
