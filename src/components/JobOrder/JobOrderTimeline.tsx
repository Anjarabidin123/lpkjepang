
import React from 'react';
import { Clock, CalendarDays, GraduationCap, User } from "lucide-react";
import { JobOrder } from '@/types/jobOrder';
import { format } from 'date-fns';
import { DetailRow } from './DetailRow';

interface JobOrderTimelineProps {
  jobOrder: JobOrder;
}

export function JobOrderTimeline({ jobOrder }: JobOrderTimelineProps) {
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Tidak tersedia';
    try {
      return format(new Date(dateString), 'EEE, dd-MMM-yyyy HH:mm:ss');
    } catch {
      return 'Tidak tersedia';
    }
  };

  const timelineItems = [
    { label: "Tanggal Recruiting", value: "Thu, 09-Mar-2023 15:10:18", icon: CalendarDays, color: "bg-blue-500" },
    { label: "Tanggal Pelatihan", value: "Wed, 09-Apr-2025 09:10:27", icon: GraduationCap, color: "bg-indigo-500" },
    { label: "Tanggal Wawancara", value: "Mon, 12-Jun-2023 13:09:37", icon: User, color: "bg-purple-500" },
    { label: "Tanggal Selesai", value: "Mon, 12-Jun-2023 13:14:20", icon: CalendarDays, color: "bg-pink-500" },
    { 
      label: "Tanggal Dibuat", 
      value: jobOrder.created_at ? formatDate(jobOrder.created_at) : 'Tidak tersedia',
      icon: Clock,
      color: "bg-emerald-500"
    },
    { 
      label: "Terakhir Diperbarui", 
      value: jobOrder.updated_at ? formatDate(jobOrder.updated_at) : 'Tidak tersedia',
      icon: Clock,
      color: "bg-amber-500"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-sm ring-1 ring-purple-100/50">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Timeline Proses</h3>
          <p className="text-sm text-slate-500 font-medium">Riwayat dan jadwal penting</p>
        </div>
      </div>
      
      <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-slate-100 before:via-slate-200 before:to-slate-100">
        {timelineItems.map((item, index) => (
          <div key={index} className="relative group animate-in fade-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`absolute -left-[31px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm transition-transform duration-300 group-hover:scale-125 z-10 ${item.color}`} />
            
            <div className="bg-white/40 p-5 rounded-2xl border border-slate-100/50 hover:bg-white/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <item.icon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
              </div>
              <div className="text-sm font-bold text-slate-900 pl-7">
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
