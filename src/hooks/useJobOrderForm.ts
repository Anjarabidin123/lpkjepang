
import { useState, useEffect } from 'react';
import { JobOrder, JobOrderInsert, JobOrderUpdateData } from '@/types/jobOrder';

interface FormData {
  nama_job_order: string;
  kumiai_id: string | undefined;
  jenis_kerja_id: string | undefined;
  catatan: string;
  status: 'Aktif' | 'Nonaktif';
  kuota?: number;
}

export function useJobOrderForm(jobOrder?: JobOrder | null) {
  const [formData, setFormData] = useState<FormData>({
    nama_job_order: '',
    kumiai_id: undefined,
    jenis_kerja_id: undefined,
    catatan: '',
    status: 'Aktif',
    kuota: undefined,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (jobOrder) {
      console.log('Setting form data from job order:', jobOrder);
      setFormData({
        nama_job_order: jobOrder.nama_job_order || '',
        kumiai_id: jobOrder.kumiai_id || undefined,
        jenis_kerja_id: jobOrder.jenis_kerja_id || undefined,
        catatan: jobOrder.catatan || '',
        status: jobOrder.status || 'Aktif',
        kuota: jobOrder.kuota || undefined,
      });
    } else {
      setFormData({
        nama_job_order: '',
        kumiai_id: undefined,
        jenis_kerja_id: undefined,
        catatan: '',
        status: 'Aktif',
        kuota: undefined,
      });
    }
    setFormErrors({});
  }, [jobOrder]);

  const handleFieldChange = (field: string, value: any) => {
    if (field === 'clearError') {
      setFormErrors(prev => ({ ...prev, [value]: '' }));
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.nama_job_order.trim()) {
      errors.nama_job_order = 'Nama job order harus diisi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getSubmitDataForCreate = (): JobOrderInsert => {
    return {
      nama_job_order: formData.nama_job_order.trim(),
      kumiai_id: formData.kumiai_id || null,
      jenis_kerja_id: formData.jenis_kerja_id || null,
      catatan: formData.catatan.trim() || null,
      status: formData.status,
      kuota: formData.kuota || null,
    };
  };

  const getSubmitDataForUpdate = (): JobOrderUpdateData => {
    return {
      nama_job_order: formData.nama_job_order.trim(),
      kumiai_id: formData.kumiai_id || null,
      jenis_kerja_id: formData.jenis_kerja_id || null,
      catatan: formData.catatan.trim() || null,
      status: formData.status,
      kuota: formData.kuota || null,
    };
  };

  return {
    formData,
    formErrors,
    handleFieldChange,
    validateForm,
    getSubmitDataForCreate,
    getSubmitDataForUpdate
  };
}
