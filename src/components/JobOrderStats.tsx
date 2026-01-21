
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, CheckCircle, XCircle, Clock } from "lucide-react";
import { JobOrder } from '@/types/jobOrder';

interface JobOrderStatsProps {
  jobOrders: JobOrder[] | undefined;
  isLoading?: boolean;
}

export function JobOrderStats({ jobOrders, isLoading }: JobOrderStatsProps) {
  if (isLoading || !jobOrders) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/95 backdrop-blur-xl border-white/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Loading...</CardTitle>
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold bg-gray-200 h-8 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalJobOrders = jobOrders.length;
  const activeJobOrders = jobOrders.filter(jo => jo.status === 'Aktif').length;
  const inactiveJobOrders = jobOrders.filter(jo => jo.status === 'Nonaktif').length;
  const withKumiai = jobOrders.filter(jo => jo.kumiai_id).length;

  const stats = [
    {
      title: "Total Job Orders",
      value: totalJobOrders,
      icon: ClipboardList,
      bgGradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconBg: "bg-blue-100/20"
    },
    {
      title: "Aktif",
      value: activeJobOrders,
      icon: CheckCircle,
      bgGradient: "bg-gradient-to-br from-green-500 to-green-600",
      iconBg: "bg-green-100/20"
    },
    {
      title: "Non Aktif",
      value: inactiveJobOrders,
      icon: XCircle,
      bgGradient: "bg-gradient-to-br from-red-500 to-red-600",
      iconBg: "bg-red-100/20"
    },
    {
      title: "Dengan Kumiai",
      value: withKumiai,
      icon: Clock,
      bgGradient: "bg-gradient-to-br from-orange-500 to-orange-600",
      iconBg: "bg-orange-100/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-modern-lg ${stat.bgGradient} text-white border-0`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-white truncate pr-2">{stat.title}</CardTitle>
            <div className={`p-2 ${stat.iconBg} rounded-xl backdrop-blur-sm`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </CardContent>
          
          {/* Background decoration */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
        </Card>
      ))}
    </div>
  );
}
