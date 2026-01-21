
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Users } from 'lucide-react';
import { type JobOrder } from '@/hooks/useJobOrder';
import { format } from 'date-fns';

interface JobOrderDetailProps {
  jobOrder: JobOrder;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function JobOrderDetail({ jobOrder, onEdit, onDelete, isDeleting }: JobOrderDetailProps) {
  const formatPesertaCount = (pesertaCount: number | undefined, kuota: number | null) => {
    const count = pesertaCount || 0;
    const quota = kuota || 0;
    return `${count}/${quota}`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{jobOrder.nama_job_order}</h3>
            <p className="text-sm text-gray-500">
              Dibuat: {jobOrder.created_at ? format(new Date(jobOrder.created_at), 'dd/MM/yyyy HH:mm') : '-'}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-xs"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={jobOrder.status === 'Aktif' ? 'default' : 'secondary'}>
              {jobOrder.status || 'Aktif'}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Peserta:</span>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">
                {formatPesertaCount(jobOrder.peserta_count, jobOrder.kuota)}
              </span>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-sm font-medium">Kumiai:</span>
            <span className="text-sm">
              {jobOrder.kumiai ? `${jobOrder.kumiai.kode} - ${jobOrder.kumiai.nama}` : 'Tidak ada'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm font-medium">Jenis Kerja:</span>
            <span className="text-sm">
              {jobOrder.jenis_kerja ? `${jobOrder.jenis_kerja.kode} - ${jobOrder.jenis_kerja.nama}` : 'Tidak ada'}
            </span>
          </div>

          {jobOrder.catatan && (
            <div>
              <span className="text-sm font-medium">Catatan:</span>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{jobOrder.catatan}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
