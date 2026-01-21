
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { SiswaMagang } from "@/hooks/useSiswaMagang";

interface SiswaMagangDetailScheduleCardProps {
  siswaMagang: SiswaMagang;
  formatDate: (dateString: string | null) => string;
  getStatusBadgeVariant: (status: string | null) => "default" | "secondary" | "destructive" | "outline";
}

export function SiswaMagangDetailScheduleCard({ 
  siswaMagang, 
  formatDate, 
  getStatusBadgeVariant 
}: SiswaMagangDetailScheduleCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-gray-700 text-lg">Jadwal Magang</span>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-500 mb-1 text-sm">Tanggal Mulai</div>
            <div className="font-semibold text-gray-900">{formatDate(siswaMagang.tanggal_mulai_kerja)}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1 text-sm">Tanggal Pulang</div>
            <div className="font-semibold text-gray-900">{formatDate(siswaMagang.tanggal_pulang_kerja)}</div>
          </div>
        </div>
        <div className="pt-3 border-t">
          <div className="text-gray-500 text-sm mb-2">Status</div>
          <Badge variant={getStatusBadgeVariant(siswaMagang.status_magang)} className="text-sm px-3 py-1">
            {siswaMagang.status_magang || 'Aktif'}
          </Badge>
        </div>
      </div>
    </div>
  );
}
