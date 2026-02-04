
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/hooks/useSiswaMagangForm';
import { BaseFormField } from './BaseFormField';
import { ColumnConfig } from '@/hooks/useColumnVisibility';

interface DetailsFieldsProps {
  form: UseFormReturn<FormData>;
  visibleColumns?: ColumnConfig[];
}

export function DetailsFields({ form, visibleColumns }: DetailsFieldsProps) {
  console.log('DetailsFields render with form values:', form.getValues());

  // Create column visibility map for easy lookup
  const columnVisibility = visibleColumns?.reduce((acc, col) => {
    acc[col.key] = col.visible;
    return acc;
  }, {} as Record<string, boolean>) || {};

  // Helper function to check if column should be visible
  const isColumnVisible = (key: string) => {
    return columnVisibility[key] === true;
  };

  const statusOptions = [
    { id: 'aktif', label: 'Aktif', value: 'Aktif' },
    { id: 'selesai', label: 'Selesai', value: 'Selesai' },
    { id: 'dipulangkan', label: 'Dipulangkan', value: 'Dipulangkan' },
    { id: 'cuti', label: 'Cuti', value: 'Cuti' }
  ];

  return (
    <>
      {/* Lokasi Field - Always show */}
      <BaseFormField
        form={form}
        name="lokasi"
        label="Lokasi"
        placeholder="Masukkan lokasi"
      />

      {/* Tanggal Mulai Kerja Field - Always show */}
      <BaseFormField
        form={form}
        name="tanggal_mulai_kerja"
        label="Tanggal Mulai Kerja"
        type="date"
      />

      {/* Tanggal Pulang Kerja Field - Always show */}
      <BaseFormField
        form={form}
        name="tanggal_pulang_kerja"
        label="Tanggal Pulang Kerja"
        type="date"
      />

      {/* Gaji Field - Always show or conditionally visible */}
      {(isColumnVisible('gaji') || !visibleColumns) && (
        <BaseFormField
          form={form}
          name="gaji"
          label="Gaji"
          type="number"
          placeholder="0"
        />
      )}

      {/* Status Magang Field - Always show */}
      <BaseFormField
        form={form}
        name="status_magang"
        label="Status Magang"
        type="select"
        placeholder="Pilih status"
        options={statusOptions}
      />

    </>
  );
}
