
import React from 'react';
import { Users } from 'lucide-react';
import { JobOrder } from '@/types/jobOrder';

interface JobOrderCardParticipantsProps {
  jobOrder: JobOrder;
}

export function JobOrderCardParticipants({ jobOrder }: JobOrderCardParticipantsProps) {
  const formatPesertaCount = (pesertaCount: number | undefined, kuota: number | null) => {
    const count = pesertaCount || 0;
    const quota = kuota || 0;
    return `${count}/${quota}`;
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-sm text-gray-600">Jumlah Peserta:</span>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-semibold text-gray-900">
          {formatPesertaCount(jobOrder.peserta_count, jobOrder.kuota)}
        </span>
      </div>
    </div>
  );
}
