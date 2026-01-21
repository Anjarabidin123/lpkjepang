
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobOrder } from '@/types/jobOrder';
import { JobOrderBasicInfo } from './JobOrder/JobOrderBasicInfo';
import { JobOrderTimeline } from './JobOrder/JobOrderTimeline';
import { StatusBadges } from './JobOrder/StatusBadges';

interface JobOrderDetailTabProps {
  jobOrder: JobOrder;
}

export function JobOrderDetailTab({ jobOrder }: JobOrderDetailTabProps) {
  const navigate = useNavigate();
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Aktif': return 'default';
      case 'Tidak Aktif': return 'destructive';
      case 'Selesai': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardHeader className="relative p-6 lg:p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          
            <CardTitle className="relative flex items-center gap-4 text-white">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md ring-1 ring-white/20 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Detail Job Order</h2>
                <p className="text-blue-100 text-xs font-medium opacity-80">Informasi Lengkap & Status Proses</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              <section className="space-y-1">
                <JobOrderBasicInfo 
                  jobOrder={jobOrder} 
                  getStatusBadgeVariant={getStatusBadgeVariant} 
                />
              </section>
  
              <section className="space-y-1">
                <JobOrderTimeline jobOrder={jobOrder} />
              </section>
            </div>
  
            <div className="mt-12 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm ring-1 ring-emerald-100/50">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Status & Progres</h3>
                  <p className="text-xs text-slate-500 font-medium tracking-tight">Tahapan pekerjaan saat ini</p>
                </div>
              </div>
              
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <StatusBadges />
              </div>
            </div>
  
            {jobOrder.catatan && (
              <div className="mt-10 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shadow-sm ring-1 ring-amber-100/50">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Catatan Khusus</h3>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">Informasi tambahan penting</p>
                  </div>
                </div>
              
                <div className="p-6 bg-amber-50/30 rounded-2xl border border-amber-100/50 italic text-slate-700 leading-relaxed text-base shadow-inner">
                  "{jobOrder.catatan}"
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 px-6 py-2 rounded-xl hover:bg-slate-50 transition-all duration-300"
              >
                <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Kembali</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}
