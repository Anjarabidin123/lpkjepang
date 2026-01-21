
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, Target, Users, Tag, Activity } from "lucide-react";
import { JobOrder } from '@/types/jobOrder';
import { DetailRow } from './DetailRow';

interface JobOrderBasicInfoProps {
  jobOrder: JobOrder;
  getStatusBadgeVariant: (status: string) => "default" | "destructive" | "secondary" | "outline";
}

export function JobOrderBasicInfo({ jobOrder, getStatusBadgeVariant }: JobOrderBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm ring-1 ring-blue-100/50">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Informasi Umum</h3>
          <p className="text-sm text-slate-500 font-medium">Data utama pekerjaan</p>
        </div>
      </div>
      
      <div className="bg-white/40 p-2 rounded-[2rem] border border-slate-100/50">
        <DetailRow 
          label="Nama Job Order" 
          value={jobOrder.nama_job_order}
          icon={Tag}
        />
        
        <DetailRow 
          label="Jenis Kerja" 
          value={jobOrder.jenis_kerja?.nama || 'Tidak ditentukan'}
          icon={Briefcase}
        />
        
        <DetailRow 
          label="Kumiai" 
          value={jobOrder.kumiai?.nama || 'Tidak ditentukan'}
          icon={Building}
        />
        
          <DetailRow 
            label="Kuota" 
            value={
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{jobOrder.kuota || 0}</span>
                <span className="text-slate-500 text-xs font-semibold">Posisi Tersedia</span>
              </div>
            }
            icon={Target}
          />
          
          <DetailRow 
            label="Jumlah Peserta" 
            value={
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-600">{jobOrder.peserta_count || 0}</span>
                <span className="text-slate-500 text-xs font-semibold">Terdaftar</span>
              </div>
            }
            icon={Users}
          />
          
          <DetailRow 
            label="Status Job Order" 
            value={
              <Badge 
                variant={getStatusBadgeVariant(jobOrder.status || 'Tidak Aktif')}
                className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1 rounded-full text-xs font-semibold transition-all duration-300"
              >
                {jobOrder.status || 'Tidak Aktif'}
              </Badge>
            }
            icon={Activity}
          />
      </div>
    </div>
  );
}
