
import React from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { JobOrder } from '@/types/jobOrder';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface JobOrderCardHeaderProps {
  jobOrder: JobOrder;
  onEdit: (jobOrder: JobOrder) => void;
  onDelete: (id: string) => void;
  onViewDetail?: (jobOrder: JobOrder) => void;
  isDeleting?: boolean;
}

export function JobOrderCardHeader({ 
  jobOrder, 
  onEdit, 
  onDelete, 
  onViewDetail, 
  isDeleting = false 
}: JobOrderCardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
        {jobOrder.nama_job_order}
      </h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onViewDetail && (
            <DropdownMenuItem onClick={() => onViewDetail(jobOrder)}>
              <Eye className="mr-2 h-4 w-4" />
              Buka Detail
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onEdit(jobOrder)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
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
                <AlertDialogAction 
                  onClick={() => onDelete(jobOrder.id)}
                  disabled={isDeleting}
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
