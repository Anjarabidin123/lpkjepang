
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, GraduationCap, Building2 } from "lucide-react";

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
  const activities: ActivityItem[] = [
    {
      type: 'success',
      title: 'Siswa baru mendaftar',
      description: `${siswa?.slice(-1)[0]?.nama || 'Ahmad Fadli'} mendaftar program baru`,
      time: '2 jam yang lalu',
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      type: 'success',
      title: 'Siswa Magang baru',
      description: `${siswaMagang?.slice(-1)[0]?.siswa?.nama || 'Siti Rahayu'} memulai magang`,
      time: '5 jam yang lalu',
      icon: GraduationCap,
      color: 'text-green-600 bg-green-100'
    },
    {
      type: 'info',
      title: 'Kumiai aktif',
      description: `${kumiai?.filter(k => k.status === 'Aktif').slice(-1)[0]?.nama || 'Kumiai Tokyo'} aktif`,
      time: '1 hari yang lalu',
      icon: Building2,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  return (
    <div className="flat-card">
      <div className="p-6 border-b border-border">
        <h2 className="flex items-center gap-4 text-xl font-bold text-foreground">
          <div className="flat-icon-container bg-primary/10">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          Aktivitas Terbaru
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-5 p-6 flat-card hover:bg-muted/30 transition-colors">
              <div className={`flat-icon-container ${activity.color}`}>
                <activity.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-2">{activity.title}</h4>
                <p className="text-muted-foreground text-sm mb-3">{activity.description}</p>
                <span className="text-xs text-muted-foreground font-medium">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
