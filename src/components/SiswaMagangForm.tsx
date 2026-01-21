
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useSiswaMagang, type SiswaMagang } from '@/hooks/useSiswaMagang';
import { useSiswaForMagang } from '@/hooks/useSiswa';
import { useKumiai } from '@/hooks/useKumiai';
import { usePerusahaan } from '@/hooks/usePerusahaan';
import { useProgram } from '@/hooks/useProgram';
import { useJenisKerja } from '@/hooks/useJenisKerja';
import { usePosisiKerja } from '@/hooks/usePosisiKerja';
import { useSiswaMagangForm } from '@/hooks/useSiswaMagangForm';
import { SiswaMagangFormHeader } from './SiswaMagang/SiswaMagangFormHeader';
import { SiswaMagangFormFields } from './SiswaMagang/SiswaMagangFormFields';
import { SiswaMagangFormActions } from './SiswaMagang/SiswaMagangFormActions';

interface SiswaMagangFormProps {
  siswaMagang?: SiswaMagang;
  onClose: () => void;
}

export function SiswaMagangForm({ siswaMagang, onClose }: SiswaMagangFormProps) {
  const { createSiswaMagang, updateSiswaMagang, isCreating, isUpdating } = useSiswaMagang();
  const { siswa, isLoading: siswaLoading } = useSiswaForMagang();
  const { kumiai, isLoading: kumiaiLoading } = useKumiai();
  const { perusahaan, isLoading: perusahaanLoading } = usePerusahaan();
  const { program, isLoading: programLoading } = useProgram();
  const { jenisKerja, isLoading: jenisKerjaLoading } = useJenisKerja();
  const { posisiKerja, isLoading: posisiKerjaLoading } = usePosisiKerja();
  
  const { form, formatDataForSubmission } = useSiswaMagangForm(siswaMagang);

  console.log('SiswaMagangForm render:', { 
    availableSiswa: siswa?.length || 0, 
    siswaLoading, 
    isEditing: !!siswaMagang,
    program: program?.length || 0,
    jenisKerja: jenisKerja?.length || 0,
    posisiKerja: posisiKerja?.length || 0,
    programData: program,
    jenisKerjaData: jenisKerja,
    posisiKerjaData: posisiKerja,
    formValues: form.getValues()
  });

  const onSubmit = async (data: any) => {
    try {
      console.log('Form submit data:', data);
      const formattedData = formatDataForSubmission(data);
      console.log('Formatted data for API:', formattedData);

      if (siswaMagang) {
        await updateSiswaMagang({ id: siswaMagang.id, ...formattedData });
      } else {
        await createSiswaMagang(formattedData);
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      // Error is already handled by the mutation hooks
    }
  };

  const isLoading = isCreating || isUpdating;
  const isDataLoading = siswaLoading || kumiaiLoading || perusahaanLoading || programLoading || jenisKerjaLoading || posisiKerjaLoading;

  if (isDataLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Memuat data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">
          {siswaMagang ? 'Edit Siswa Magang' : 'Tambah Siswa Magang'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SiswaMagangFormHeader form={form} />
            
            <SiswaMagangFormFields
              form={form}
              siswa={siswa}
              kumiai={kumiai}
              perusahaan={perusahaan}
              program={program}
              jenisKerja={jenisKerja}
              posisiKerja={posisiKerja}
            />
            
            <SiswaMagangFormActions
              isLoading={isLoading}
              onCancel={onClose}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
