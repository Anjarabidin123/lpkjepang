
import React from 'react';
import { StatsCard } from "@/components/StatsCard";
import { GraduationCap, Users, BookOpen } from "lucide-react";
import type { SiswaMagang } from "@/types/siswaMagang";

interface SiswaMagangStatsProps {
  siswaMagang: SiswaMagang[];
}

export function SiswaMagangStats({ siswaMagang }: SiswaMagangStatsProps) {
  const totalSiswaMagang = siswaMagang.length;
  const aktiveSiswaMagang = siswaMagang.filter(item => item.status_magang === 'Aktif').length;
  const uniquePrograms = new Set(siswaMagang.map(item => item.program_id).filter(Boolean)).size;

  const stats = [
    {
      title: "Total Siswa Magang",
      value: totalSiswaMagang.toString(),
      icon: GraduationCap,
      className: "bg-gradient-to-br from-blue-500 to-blue-600",
      trend: `${aktiveSiswaMagang} siswa aktif`,
      trendUp: true
    },
    {
      title: "Siswa Aktif",
      value: aktiveSiswaMagang.toString(),
      icon: Users,
      className: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      trend: `${totalSiswaMagang > 0 ? Math.round((aktiveSiswaMagang / totalSiswaMagang) * 100) : 0}% dari total siswa`,
      trendUp: true
    },
    {
      title: "Program Aktif",
      value: uniquePrograms.toString(),
      icon: BookOpen,
      className: "bg-gradient-to-br from-purple-500 to-purple-600",
      trend: "Program pembelajaran",
      trendUp: true
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          trendUp={stat.trendUp}
          className={stat.className}
        />
      ))}
    </div>
  );
}
