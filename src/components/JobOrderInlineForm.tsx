
import React from 'react';
import { useJobOrder, type JobOrder } from '@/hooks/useJobOrder';
import { useKumiai } from '@/hooks/useKumiai';
import { useJenisKerja } from '@/hooks/useJenisKerja';
import { useJobOrderForm } from '@/hooks/useJobOrderForm';
import { JobOrderFormHeader } from '@/components/JobOrder/JobOrderFormHeader';
import { JobOrderFormFields } from '@/components/JobOrder/JobOrderFormFields';
import { JobOrderFormActions } from '@/components/JobOrder/JobOrderFormActions';

interface JobOrderInlineFormProps {
  jobOrder?: JobOrder | null;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function JobOrderInlineForm({ jobOrder, onCancel, onSuccess }: JobOrderInlineFormProps) {
  const { createJobOrder, updateJobOrder, isCreating, isUpdating } = useJobOrder();
  const { kumiai } = useKumiai();
  const { jenisKerja } = useJenisKerja();

  const {
    formData,
    formErrors,
    handleFieldChange,
    validateForm,
    getSubmitDataForCreate,
    getSubmitDataForUpdate
  } = useJobOrderForm(jobOrder);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted with data:', formData);

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      if (jobOrder) {
        const submitData = getSubmitDataForUpdate();
        console.log('Updating existing job order:', jobOrder.id, submitData);
        updateJobOrder(
          { id: jobOrder.id, data: submitData },
          {
            onSuccess: () => {
              if (onSuccess) onSuccess();
            },
          }
        );
      } else {
        const submitData = getSubmitDataForCreate();
        console.log('Creating new job order:', submitData);
        createJobOrder(submitData, {
          onSuccess: () => {
            if (onSuccess) onSuccess();
          },
        });
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const isLoading = isCreating || isUpdating;
  const isFormValid = formData.nama_job_order.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <JobOrderFormHeader
        jobOrder={jobOrder}
        isLoading={isLoading}
        onCancel={onCancel}
      />

      <JobOrderFormFields
        formData={formData}
        formErrors={formErrors}
        isLoading={isLoading}
        kumiai={kumiai}
        jenisKerja={jenisKerja}
        onFieldChange={handleFieldChange}
      />

      <JobOrderFormActions
        isLoading={isLoading}
        isFormValid={isFormValid}
        onCancel={onCancel}
      />
    </form>
  );
}
