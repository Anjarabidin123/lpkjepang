
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { JobOrder } from '@/types/jobOrder';
import { JobOrderCardHeader } from './JobOrderCard/JobOrderCardHeader';
import { JobOrderCardDetails } from './JobOrderCard/JobOrderCardDetails';
import { JobOrderCardProcessDates } from './JobOrderCard/JobOrderCardProcessDates';
import { JobOrderCardParticipants } from './JobOrderCard/JobOrderCardParticipants';
import { JobOrderCardStatus } from './JobOrderCard/JobOrderCardStatus';

interface JobOrderCardProps {
  jobOrder: JobOrder;
  onEdit: (jobOrder: JobOrder) => void;
  onDelete: (id: string) => void;
  onView?: (jobOrder: JobOrder) => void;
  onViewDetail?: (jobOrder: JobOrder) => void;
  isDeleting?: boolean;
}

export function JobOrderCard({ 
  jobOrder, 
  onEdit, 
  onDelete, 
  onView, 
  onViewDetail, 
  isDeleting = false 
}: JobOrderCardProps) {
  return (
    <Card className="group hover:shadow-modern-lg transition-all duration-300 bg-white/95 backdrop-blur-xl border-white/30 hover:border-blue-200/50">
      <CardContent className="p-0">
        <div className="p-8 space-y-6">
          <JobOrderCardHeader 
            jobOrder={jobOrder}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDetail={onViewDetail}
            isDeleting={isDeleting}
          />

          <div className="space-y-5">
            <JobOrderCardDetails jobOrder={jobOrder} />
            <JobOrderCardProcessDates jobOrder={jobOrder} />
            <JobOrderCardParticipants jobOrder={jobOrder} />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <JobOrderCardStatus jobOrder={jobOrder} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
