
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Globe, Map } from "lucide-react";

interface DashboardLocationDistributionProps {
  siswaMagang?: any[];
}

export function DashboardLocationDistribution({ siswaMagang }: DashboardLocationDistributionProps) {
  // Calculate real location distribution from siswaMagang data
  const locationsMap = (siswaMagang || []).reduce((acc, sm) => {
    const loc = sm.lokasi || 'Belum Ditentukan';
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const totalCount = Object.values(locationsMap).reduce((a: any, b: any) => a + b, 0) as number;

  const locationData = Object.entries(locationsMap).map(([city, count]) => ({
    city,
    count: count as number,
    percentage: totalCount > 0 ? Math.round(((count as number) / totalCount) * 100) : 0,
    color: city.toLowerCase().includes('tokyo') ? 'bg-blue-500' :
      city.toLowerCase().includes('osaka') ? 'bg-emerald-500' :
        city.toLowerCase().includes('nagoya') ? 'bg-orange-500' : 'bg-slate-400'
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="flat-card h-full">
      <div className="p-8 border-b border-slate-50 bg-slate-50/50">
        <h2 className="flex items-center gap-3 text-lg font-black text-slate-800 font-outfit uppercase tracking-tight">
          <Globe className="w-5 h-5 text-primary" />
          Sebaran Geografis Penempatan
        </h2>
      </div>
      <div className="p-8">
        {locationData.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <Map className="w-12 h-12 text-slate-100" />
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Belum ada data penempatan</p>
          </div>
        ) : (
          <div className="space-y-6">
            {locationData.slice(0, 5).map((item, index) => (
              <div key={index} className="space-y-2 group">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight font-outfit">{item.city}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 font-outfit">{item.count}</span>
                    <span className="text-[10px] font-bold text-slate-400 ml-1">SISWA</span>
                  </div>
                </div>
                <div className="relative h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 ${item.color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
