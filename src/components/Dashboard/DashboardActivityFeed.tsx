
import React from 'react';
import { Activity, Users, GraduationCap, Building2, Sparkles } from "lucide-react";

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  time: string;
  icon: any;
  color: string;
}

interface DashboardActivityFeedProps {
  siswa?: any[];
  siswaMagang?: any[];
  kumiai?: any[];
}

export function DashboardActivityFeed({ siswa, siswaMagang, kumiai }: DashboardActivityFeedProps) {
  const activities: ActivityItem[] = [];

  if (siswa && siswa.length > 0) {
    const latestSiswa = siswa[siswa.length - 1];
    activities.push({
      type: 'success',
      title: 'Siswa Baru',
      description: `${latestSiswa.nama} mendaftar`,
      time: new Date(latestSiswa.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      icon: Users,
      color: 'text-blue-600 bg-blue-50'
    });
  }

  if (siswaMagang && siswaMagang.length > 0) {
    const latestMagang = siswaMagang[siswaMagang.length - 1];
    activities.push({
      type: 'success',
      title: 'Status Magang',
      description: `${latestMagang.siswa?.nama || 'Siswa'} mulai magang`,
      time: new Date(latestMagang.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      icon: GraduationCap,
      color: 'text-emerald-600 bg-emerald-50'
    });
  }

  if (kumiai && kumiai.length > 0) {
    const latestKumiai = kumiai[kumiai.length - 1];
    activities.push({
      type: 'info',
      title: 'Update Kumiai',
      description: `${latestKumiai.nama} diperbarui`,
      time: new Date(latestKumiai.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      icon: Building2,
      color: 'text-orange-600 bg-orange-50'
    });
  }

  return (
    <div className="flat-card h-full">
      <div className="p-5 sm:p-8 border-b border-slate-50 bg-slate-50/50">
        <h2 className="flex items-center gap-3 text-base sm:text-lg font-black text-slate-800 font-outfit uppercase tracking-tight">
          <Activity className="w-5 h-5 text-primary" />
          Log Aktivitas
        </h2>
      </div>
      <div className="p-4 sm:p-6">
        {activities.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="h-10 w-10 mx-auto mb-4 text-slate-200 animate-pulse" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Belum ada aktivitas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/80 border border-transparent hover:border-slate-100">
                <div className={`p-3 rounded-xl ${activity.color} transition-transform group-hover:scale-110`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-black text-slate-900 truncate">{activity.title}</h4>
                    <span className="text-[10px] font-black text-slate-300 uppercase shrink-0">{activity.time}</span>
                  </div>
                  <p className="text-[13px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
