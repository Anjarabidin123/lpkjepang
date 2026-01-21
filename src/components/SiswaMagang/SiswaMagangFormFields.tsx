
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from '@/hooks/useSiswaMagangForm';
import { ColumnConfig } from '@/hooks/useColumnVisibility';
import { StudentFields } from './FormFields/StudentFields';
import { OrganizationFields } from './FormFields/OrganizationFields';
import { WorkFields } from './FormFields/WorkFields';
import { DetailsFields } from './FormFields/DetailsFields';
import { LocationSelector } from './LocationSelector';

interface SiswaMagangFormFieldsProps {
  form: UseFormReturn<FormData>;
  siswa: Array<{ id: string; nama: string; nik: string }> | undefined;
  kumiai: Array<{ id: string; nama: string; kode: string }> | undefined;
  perusahaan: Array<{ id: string; nama: string; kode: string }> | undefined;
  program: Array<{ id: string; nama: string; kode: string }> | undefined;
  jenisKerja: Array<{ id: string; nama: string; kode: string }> | undefined;
  posisiKerja: Array<{ id: string; posisi: string; kode: string }> | undefined;
  visibleColumns?: ColumnConfig[];
}

export function SiswaMagangFormFields({
  form,
  siswa,
  kumiai,
  perusahaan,
  program,
  jenisKerja,
  posisiKerja,
  visibleColumns
}: SiswaMagangFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium mb-4">Informasi Dasar</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StudentFields form={form} siswa={siswa} />
        </div>
      </div>

      {/* Organization Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium mb-4">Organisasi</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <OrganizationFields 
            form={form} 
            kumiai={kumiai} 
            perusahaan={perusahaan}
            visibleColumns={visibleColumns}
          />
        </div>
      </div>

      {/* Work Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium mb-4">Detail Pekerjaan</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <WorkFields 
            form={form} 
            program={program} 
            jenisKerja={jenisKerja} 
            posisiKerja={posisiKerja}
            visibleColumns={visibleColumns}
          />
        </div>
      </div>

      {/* Location Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium mb-4">Lokasi</h3>
        <LocationSelector form={form} />
      </div>

      {/* Additional Details */}
      <div>
        <h3 className="text-lg font-medium mb-4">Detail Tambahan</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <DetailsFields 
            form={form} 
            visibleColumns={visibleColumns}
          />
        </div>
      </div>
    </div>
  );
}
