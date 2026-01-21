
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { SiswaMagang } from "@/types/siswaMagang";

interface DashboardLocationDistributionProps {
  siswaMagang?: SiswaMagang[];
}

export function DashboardLocationDistribution({ siswaMagang }: DashboardLocationDistributionProps) {
  const locationData = [
    { 
      city: 'Tokyo', 
      count: siswaMagang?.filter(sm => sm.lokasi?.toLowerCase().includes('tokyo')).length || 68, 
      color: 'bg-blue-500', 
      percentage: 85 
    },
    { 
      city: 'Osaka', 
      count: siswaMagang?.filter(sm => sm.lokasi?.toLowerCase().includes('osaka')).length || 45, 
      color: 'bg-green-500', 
      percentage: 65 
    },
    { 
      city: 'Nagoya', 
      count: siswaMagang?.filter(sm => sm.lokasi?.toLowerCase().includes('nagoya')).length || 32, 
      color: 'bg-purple-500', 
      percentage: 45 
    },
    { 
      city: 'Lainnya', 
      count: siswaMagang?.filter(sm => sm.lokasi && !['tokyo', 'osaka', 'nagoya'].some(city => sm.lokasi?.toLowerCase().includes(city))).length || 41, 
      color: 'bg-orange-500', 
      percentage: 55 
    }
  ];

  return (
    <div className="flat-card">
      <div className="p-6 border-b border-border">
        <h2 className="flex items-center gap-4 text-xl font-bold text-foreground">
          <div className="flat-icon-container bg-primary/10">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          Sebaran Penempatan
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-5">
          {locationData.map((location, index) => (
            <div key={location.city} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 ${location.color} rounded-full`}></div>
                <span className="font-semibold text-foreground">{location.city}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 bg-border rounded-full h-3">
                  <div className={`${location.color} h-3 rounded-full transition-all duration-1000`} 
                       style={{ width: `${Math.min(location.percentage, 100)}%` }}></div>
                </div>
                <span className="font-bold text-foreground min-w-[2.5rem] text-right">{location.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
