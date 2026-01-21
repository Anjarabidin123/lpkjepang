
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/hooks/useSiswaMagangForm';
import { BaseFormField } from './BaseFormField';

interface StudentFieldsProps {
  form: UseFormReturn<FormData>;
  siswa: Array<{ id: string; nama: string; nik: string }> | undefined;
}

export function StudentFields({ form, siswa }: StudentFieldsProps) {
  console.log('StudentFields render with siswa:', siswa?.length || 0, 'available students');
  
  const siswaOptions = siswa?.map(item => ({
    id: item.id,
    label: `${item.nama} - ${item.nik}`,
    value: item.id
  })) || [];

  console.log('Processed siswa options:', siswaOptions.length);

  return (
    <BaseFormField
      form={form}
      name="siswa_id"
      label="Siswa"
      required
      type="select"
      placeholder="Pilih siswa"
      options={siswaOptions}
    />
  );
}
