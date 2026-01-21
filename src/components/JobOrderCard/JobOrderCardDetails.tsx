
import React from 'react';
import { JobOrder } from '@/types/jobOrder';

interface JobOrderCardDetailsProps {
  jobOrder: JobOrder;
}

export function JobOrderCardDetails({ jobOrder }: JobOrderCardDetailsProps) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Jenis Job:</span>
        <span className="text-sm font-medium text-gray-900">
          {jobOrder.jenis_kerja?.nama || 'Makanan'}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Kumiai:</span>
        <span className="text-sm font-medium text-gray-900">
          {jobOrder.kumiai ? `${jobOrder.kumiai.kode}` : 'Kumiai JKL'}
        </span>
      </div>
    </div>
  );
}
