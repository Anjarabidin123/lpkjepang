
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Edit } from "lucide-react";
import { JobOrder } from '@/types/jobOrder';
import { format } from 'date-fns';

interface JobOrderInlineDetailProps {
  jobOrder: JobOrder;
  onEdit: () => void;
  onClose: () => void;
}

export function JobOrderInlineDetail({ jobOrder, onEdit, onClose }: JobOrderInlineDetailProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Detail Job Order</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nama Job Order</label>
              <p className="text-lg font-semibold">{jobOrder.nama_job_order}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <Badge variant={jobOrder.status === 'Aktif' ? 'default' : 'secondary'}>
                  {jobOrder.status || 'Aktif'}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Kumiai</label>
              <p className="text-sm">
                {jobOrder.kumiai ? `${jobOrder.kumiai.kode} - ${jobOrder.kumiai.nama}` : 'Tidak ada'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Jenis Kerja</label>
              <p className="text-sm">
                {jobOrder.jenis_kerja ? `${jobOrder.jenis_kerja.kode} - ${jobOrder.jenis_kerja.nama}` : 'Tidak ada'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Tanggal Dibuat</label>
              <p className="text-sm">
                {jobOrder.created_at ? format(new Date(jobOrder.created_at), 'dd/MM/yyyy HH:mm') : '-'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Terakhir Diperbarui</label>
              <p className="text-sm">
                {jobOrder.updated_at ? format(new Date(jobOrder.updated_at), 'dd/MM/yyyy HH:mm') : '-'}
              </p>
            </div>

            {jobOrder.catatan && (
              <div>
                <label className="text-sm font-medium text-gray-600">Catatan</label>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md mt-1">
                  {jobOrder.catatan}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
