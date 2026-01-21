
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { JobOrder } from '@/types/jobOrder';

interface JobOrderCardStatusProps {
  jobOrder: JobOrder;
}

export function JobOrderCardStatus({ jobOrder }: JobOrderCardStatusProps) {
  const getStatusBadge = () => {
    const status = jobOrder.status || 'Aktif';
    if (status === 'Aktif') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="flex justify-center">
      {getStatusBadge()}
    </div>
  );
}
