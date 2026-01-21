
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users } from "lucide-react";
import { JobOrder } from '@/types/jobOrder';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface JobOrderTableProps {
  jobOrders: JobOrder[];
  onEdit: (jobOrder: JobOrder) => void;
  onDelete: (id: string) => void;
  onView?: (jobOrder: JobOrder) => void;
  onViewDetail?: (jobOrder: JobOrder) => void;
  isDeleting: boolean;
}

export function JobOrderTable({ jobOrders, onEdit, onDelete, onView, onViewDetail, isDeleting }: JobOrderTableProps) {
  const formatPesertaCount = (pesertaCount: number | undefined, kuota: number | null) => {
    const count = pesertaCount || 0;
    const quota = kuota || 0;
    return `${count}/${quota}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Job Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Kumiai</TableHead>
            <TableHead>Jenis Kerja</TableHead>
            <TableHead>Peserta</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobOrders.map((jobOrder) => (
            <TableRow key={jobOrder.id}>
              <TableCell className="font-medium">
                {jobOrder.nama_job_order}
              </TableCell>
              <TableCell>
                <Badge variant={jobOrder.status === 'Aktif' ? 'default' : 'secondary'}>
                  {jobOrder.status || 'Aktif'}
                </Badge>
              </TableCell>
              <TableCell>
                {jobOrder.kumiai ? `${jobOrder.kumiai.kode} - ${jobOrder.kumiai.nama}` : '-'}
              </TableCell>
              <TableCell>
                {jobOrder.jenis_kerja ? `${jobOrder.jenis_kerja.kode} - ${jobOrder.jenis_kerja.nama}` : '-'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">
                    {formatPesertaCount(jobOrder.peserta_count, jobOrder.kuota)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {jobOrder.created_at ? format(new Date(jobOrder.created_at), 'dd/MM/yyyy HH:mm') : '-'}
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-2 w-fit">
                  {onViewDetail && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(jobOrder)}
                      className="text-xs"
                    >
                      Detail
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(jobOrder)}
                    className="text-xs"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeleting}
                        className="text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Job Order</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus job order "{jobOrder.nama_job_order}"? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(jobOrder.id)}>
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
