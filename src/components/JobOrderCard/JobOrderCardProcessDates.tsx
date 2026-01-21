
import React from 'react';
import { Calendar } from 'lucide-react';
import { JobOrder } from '@/types/jobOrder';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface JobOrderCardProcessDatesProps {
  jobOrder: JobOrder;
}

export function JobOrderCardProcessDates({ jobOrder }: JobOrderCardProcessDatesProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: id });
    } catch {
      return '-';
    }
  };

  const processSteps = [
    { label: 'Rekrut', date: jobOrder.created_at },
    { label: 'Cetak', date: null },
    { label: 'Wawancara', date: null },
    { label: 'Pelatihan', date: null },
    { label: 'Selesai', date: null }
  ];

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Tanggal Proses</h4>
      <div className="space-y-2">
        {processSteps.map((step, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-xs text-gray-600">{step.label}:</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-900">
                {formatDate(step.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
