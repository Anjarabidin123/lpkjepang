
import React from 'react';
import { ClipboardList, CheckCircle, XCircle, Clock } from "lucide-react";
import { JobOrder } from '@/types/jobOrder';
import { ModuleStatCard } from './layout/ModulePageLayout';

interface JobOrderStatsProps {
  jobOrders: JobOrder[] | undefined;
  isLoading?: boolean;
}

export function JobOrderStatsCompact({ jobOrders, isLoading }: JobOrderStatsProps) {
  if (isLoading || !jobOrders) {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
        ))}
      </>
    );
  }

  const totalJobOrders = jobOrders.length;
  const activeJobOrders = jobOrders.filter(jo => jo.status === 'Aktif').length;
  const inactiveJobOrders = jobOrders.filter(jo => jo.status === 'Nonaktif').length;
  const withKumiai = jobOrders.filter(jo => jo.kumiai_id).length;

  return (
    <>
      <ModuleStatCard 
        label="Total Job Orders" 
        value={totalJobOrders} 
        icon={<ClipboardList className="w-4 h-4" />} 
        color="primary" 
      />
      <ModuleStatCard 
        label="Aktif" 
        value={activeJobOrders} 
        icon={<CheckCircle className="w-4 h-4" />} 
        color="success" 
      />
      <ModuleStatCard 
        label="Non Aktif" 
        value={inactiveJobOrders} 
        icon={<XCircle className="w-4 h-4" />} 
        color="error" 
      />
      <ModuleStatCard 
        label="Dengan Kumiai" 
        value={withKumiai} 
        icon={<Clock className="w-4 h-4" />} 
        color="warning" 
      />
    </>
  );
}
