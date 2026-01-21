
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { MonitoringTableData } from '@/types/monitoring';
import { getTrendIcon, getStatusBadge } from './MonitoringTableUtils';

interface MonitoringTableMobileProps {
  data: MonitoringTableData[];
}

export function MonitoringTableMobile({ data }: MonitoringTableMobileProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-responsive-sm">Tidak ada data yang ditemukan</p>
        <p className="text-xs">Coba ubah filter atau kata kunci pencarian</p>
      </div>
    );
  }

  return (
    <div className="block sm:hidden space-y-4">
      {data.map((item) => (
        <div key={item.id} className="table-mobile-card">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-responsive-sm">{item.nama}</h3>
              <Badge variant="outline" className="mt-1 text-xs bg-gray-50">
                {item.kategori}
              </Badge>
            </div>
            {getStatusBadge(item.status)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Target:</span>
              <p className="font-mono font-medium">{item.target.toLocaleString('id-ID')}</p>
            </div>
            <div>
              <span className="text-gray-500">Pencapaian:</span>
              <p className="font-mono font-medium">{item.pencapaian.toLocaleString('id-ID')}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.persentase >= 100 ? 'bg-green-500' : 
                    item.persentase >= 80 ? 'bg-blue-500' : 
                    item.persentase >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(item.persentase, 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium min-w-[2.5rem]">
                {item.persentase}%
              </span>
            </div>
            <div className="ml-2">
              {getTrendIcon(item.trend)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
