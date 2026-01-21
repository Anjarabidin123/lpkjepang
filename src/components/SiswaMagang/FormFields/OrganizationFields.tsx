
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/hooks/useSiswaMagangForm';
import { BaseFormField } from './BaseFormField';
import { ColumnConfig } from '@/hooks/useColumnVisibility';
import { useLpkMitra } from '@/hooks/useLpkMitra';

interface OrganizationFieldsProps {
  form: UseFormReturn<FormData>;
  kumiai: Array<{ id: string; nama: string; kode: string }> | undefined;
  perusahaan: Array<{ id: string; nama: string; kode: string }> | undefined;
  visibleColumns?: ColumnConfig[];
}

export function OrganizationFields({ form, kumiai, perusahaan, visibleColumns }: OrganizationFieldsProps) {
  const { lpkMitras } = useLpkMitra();
  
  // Create column visibility map for easy lookup
  const columnVisibility = visibleColumns?.reduce((acc, col) => {
    acc[col.key] = col.visible;
    return acc;
  }, {} as Record<string, boolean>) || {};

  const kumiaiOptions = kumiai?.map(item => ({
    id: item.id,
    label: `${item.nama} - ${item.kode}`,
    value: item.id
  })) || [];

  const perusahaanOptions = perusahaan?.map(item => ({
    id: item.id,
    label: `${item.nama} - ${item.kode}`,
    value: item.id
  })) || [];

  const lpkMitraOptions = lpkMitras?.map(item => ({
    id: item.id,
    label: `${item.nama_lpk} - ${item.kode}`,
    value: item.id
  })) || [];

  return (
    <>
      {/* Kumiai - Always show */}
      <BaseFormField
        form={form}
        name="kumiai_id"
        label="Kumiai"
        type="select"
        placeholder="Pilih kumiai"
        options={kumiaiOptions}
      />

      {/* Perusahaan - Always show */}
      <BaseFormField
        form={form}
        name="perusahaan_id"
        label="Perusahaan"
        type="select"
        placeholder="Pilih perusahaan"
        options={perusahaanOptions}
      />

      {/* LPK Mitra - Show if column is visible */}
      {columnVisibility['lpk_mitra'] !== false && (
        <BaseFormField
          form={form}
          name="lpk_mitra_id"
          label="LPK Mitra"
          type="select"
          placeholder="Pilih LPK Mitra"
          options={lpkMitraOptions}
        />
      )}
    </>
  );
}
