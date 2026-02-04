
import React from 'react';
import { Users, GraduationCap, Briefcase, Building2, TrendingUp } from "lucide-react";
import { formatNumber } from '@/lib/format';

interface DashboardStatsGridProps {
  stats: {
    siswa: number;
    jobOrders: number;
    kumiai: number;
    perusahaan: number;
  };
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const items = [
    {
      label: 'Total Siswa',
      value: stats.siswa,
      icon: Users,
      color: 'blue',
      trend: '+12% MoM'
    },
    {
      label: 'Job Order Aktif',
      value: stats.jobOrders,
      icon: Briefcase,
      color: 'purple',
      trend: '+3 Baru'
    },
    {
      label: 'Kumiai Jepang',
      value: stats.kumiai,
      icon: Building2,
      color: 'emerald',
      trend: 'Stabil'
    },
    {
      label: 'Mitra Perusahaan',
      value: stats.perusahaan,
      icon: TrendingUp,
      color: 'orange',
      trend: '+2 Baru'
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, idx) => (
        <div key={idx} className="flat-card p-6 flex flex-col justify-between group">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-2xl ${colorMap[item.color]} transition-transform group-hover:scale-110 duration-500`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black text-slate-500">{item.trend}</span>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.label}</p>
            <h2 className="text-3xl font-black text-slate-900 font-sans tracking-tighter">
              {formatNumber(item.value)}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}
