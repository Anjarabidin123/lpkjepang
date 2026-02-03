
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/hooks/useSiswaMagangForm';
import { BaseFormField } from './BaseFormField';
import { ColumnConfig } from '@/hooks/useColumnVisibility';

interface WorkFieldsProps {
  form: UseFormReturn<FormData>;
  program: Array<{ id: string; nama: string; kode: string }> | undefined;
  jenisKerja: Array<{ id: string; nama: string; kode: string }> | undefined;
  posisiKerja: Array<{ id: string; posisi: string; kode: string }> | undefined;
  visibleColumns?: ColumnConfig[];
}

export function WorkFields({ form, program, jenisKerja, posisiKerja, visibleColumns }: WorkFieldsProps) {
  console.log('WorkFields render with data:', {
    program: program?.length || 0,
    jenisKerja: jenisKerja?.length || 0,
    posisiKerja: posisiKerja?.length || 0,
    programData: program,
    jenisKerjaData: jenisKerja,
    posisiKerjaData: posisiKerja
  });

  // Create column visibility map for easy lookup
  const columnVisibility = visibleColumns?.reduce((acc, col) => {
    acc[col.key] = col.visible;
    return acc;
  }, {} as Record<string, boolean>) || {};

  // Helper function to check if column should be visible
  const isColumnVisible = (key: string) => {
    return columnVisibility[key] === true;
  };

  const programOptions = program?.map(item => ({
    id: item.id,
    label: `${item.nama} - ${item.kode}`,
    value: item.id
  })) || [];

  const jenisKerjaOptions = jenisKerja?.map(item => ({
    id: item.id,
    label: `${item.nama} - ${item.kode}`,
    value: item.id
  })) || [];

  const posisiKerjaOptions = posisiKerja?.map(item => ({
    id: item.id,
    label: `${item.nama} - ${item.kode}`,
    value: item.id
  })) || [];

  console.log('Mapped options:', {
    programOptions,
    jenisKerjaOptions,
    posisiKerjaOptions
  });

  return (
    <>
      {/* Program Field - Always show or conditionally visible */}
      {(isColumnVisible('program') || !visibleColumns) && (
        <BaseFormField
          form={form}
          name="program_id"
          label="Program"
          type="select"
          placeholder="Pilih program"
          options={programOptions}
        />
      )}

      {/* Jenis Kerja Field - Always show or conditionally visible */}
      {(isColumnVisible('jenis_kerja') || !visibleColumns) && (
        <BaseFormField
          form={form}
          name="jenis_kerja_id"
          label="Jenis Kerja"
          type="select"
          placeholder="Pilih jenis kerja"
          options={jenisKerjaOptions}
        />
      )}

      {/* Posisi Kerja Field - Always show or conditionally visible */}
      {(isColumnVisible('posisi_kerja') || !visibleColumns) && (
        <BaseFormField
          form={form}
          name="posisi_kerja_id"
          label="Posisi Kerja"
          type="select"
          placeholder="Pilih posisi kerja"
          options={posisiKerjaOptions}
        />
      )}
    </>
  );
}
