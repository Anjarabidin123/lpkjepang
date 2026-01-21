
import React from 'react';
import { Form } from '@/components/ui/form';
import { TableCell, TableRow } from '@/components/ui/table';
import { useSiswaMagang, type SiswaMagang } from '@/hooks/useSiswaMagang';
import { useSiswaForMagang } from '@/hooks/useSiswa';
import { useKumiai } from '@/hooks/useKumiai';
import { usePerusahaan } from '@/hooks/usePerusahaan';
import { useProgram } from '@/hooks/useProgram';
import { useJenisKerja } from '@/hooks/useJenisKerja';
import { usePosisiKerja } from '@/hooks/usePosisiKerja';
import { useSiswaMagangForm, FormData } from '@/hooks/useSiswaMagangForm';
import { SiswaMagangFormHeader } from '@/components/SiswaMagang/SiswaMagangFormHeader';
import { SiswaMagangFormFields } from '@/components/SiswaMagang/SiswaMagangFormFields';
import { SiswaMagangFormActions } from '@/components/SiswaMagang/SiswaMagangFormActions';
import { ColumnConfig } from "@/hooks/useColumnVisibility";

interface SiswaMagangInlineFormProps {
  siswaMagang?: SiswaMagang;
  onSave: () => void;
  onCancel: () => void;
  visibleColumns?: ColumnConfig[];
}

export function SiswaMagangInlineForm({ siswaMagang, onSave, onCancel, visibleColumns }: SiswaMagangInlineFormProps) {
  console.log('SiswaMagangInlineForm render:', { siswaMagang: siswaMagang?.id, mode: siswaMagang ? 'edit' : 'create' });
  
  const { createSiswaMagang, updateSiswaMagang, isCreating, isUpdating } = useSiswaMagang();
  const { siswa, isLoading: siswaLoading } = useSiswaForMagang();
  const { kumiai, isLoading: kumiaiLoading } = useKumiai();
  const { perusahaan, isLoading: perusahaanLoading } = usePerusahaan();
  const { program, isLoading: programLoading } = useProgram();
  const { jenisKerja, isLoading: jenisKerjaLoading } = useJenisKerja();
  const { posisiKerja, isLoading: posisiKerjaLoading } = usePosisiKerja();

  const { form, formatDataForSubmission } = useSiswaMagangForm(siswaMagang);

  console.log('Available data for inline form:', {
    siswa: siswa?.length || 0,
    program: program?.length || 0,
    jenisKerja: jenisKerja?.length || 0,
    posisiKerja: posisiKerja?.length || 0,
    programData: program,
    jenisKerjaData: jenisKerja,
    posisiKerjaData: posisiKerja,
    formValues: form.getValues()
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form submission started with data:', data);
      
      // Validate required fields
      if (!data.siswa_id) {
        form.setError('siswa_id', {
          type: 'required',
          message: 'Siswa harus dipilih'
        });
        return;
      }
      
      const formattedData = formatDataForSubmission(data);
      console.log('Formatted data for submission:', formattedData);

      if (siswaMagang) {
        console.log('Updating existing siswa magang:', siswaMagang.id);
        await updateSiswaMagang({ id: siswaMagang.id, ...formattedData });
      } else {
        console.log('Creating new siswa magang');
        await createSiswaMagang(formattedData);
      }
      
      console.log('Form submission completed successfully');
      
      // Reset form and call onSave
      form.reset();
      onSave();
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error message in form if validation fails
      if (error instanceof Error) {
        form.setError('root', {
          type: 'submit',
          message: error.message
        });
      }
    }
  };

  const handleCancel = () => {
    console.log('Form cancelled, resetting form');
    form.reset();
    onCancel();
  };

  const isDataLoading = siswaLoading || kumiaiLoading || perusahaanLoading || programLoading || jenisKerjaLoading || posisiKerjaLoading;
  const isFormLoading = isCreating || isUpdating;

  // Calculate total visible columns correctly
  const totalVisibleColumns = visibleColumns?.filter(col => col.visible).length || 12;

  if (isDataLoading) {
    return (
      <TableRow className="bg-blue-50 border-l-4 border-blue-500">
        <TableCell colSpan={totalVisibleColumns} className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data...</p>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="bg-blue-50 border-l-4 border-blue-500">
      <TableCell colSpan={totalVisibleColumns} className="p-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {siswaMagang ? 'Edit Siswa Magang' : 'Tambah Siswa Magang Baru'}
            </h3>
            <p className="text-sm text-gray-600">
              {siswaMagang ? 'Perbarui informasi siswa magang' : 'Lengkapi form untuk menambah siswa magang baru'}
            </p>
            {!siswaMagang && siswa && siswa.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Informasi:</strong> Semua siswa sudah terdaftar di Siswa Magang. 
                  Tidak ada siswa yang tersedia untuk ditambahkan.
                </p>
              </div>
            )}
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <SiswaMagangFormHeader form={form} />

              <SiswaMagangFormFields
                form={form}
                siswa={siswa}
                kumiai={kumiai}
                perusahaan={perusahaan}
                program={program}
                jenisKerja={jenisKerja}
                posisiKerja={posisiKerja}
                visibleColumns={visibleColumns}
              />

              {/* Show form-level errors */}
              {form.formState.errors.root && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded border border-red-200">
                  <strong>Error:</strong> {form.formState.errors.root.message}
                </div>
              )}

              <SiswaMagangFormActions
                isLoading={isFormLoading}
                onCancel={handleCancel}
                disabled={!siswaMagang && siswa && siswa.length === 0}
              />
            </form>
          </Form>
        </div>
      </TableCell>
    </TableRow>
  );
}
