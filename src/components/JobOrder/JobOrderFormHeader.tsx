
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { JobOrder } from '@/types/jobOrder';

interface JobOrderFormHeaderProps {
  jobOrder?: JobOrder | null;
  isLoading: boolean;
  onCancel: () => void;
}

export function JobOrderFormHeader({ jobOrder, isLoading, onCancel }: JobOrderFormHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">
        {jobOrder ? 'Edit Job Order' : 'Tambah Job Order Baru'}
      </h3>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCancel}
        disabled={isLoading}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
