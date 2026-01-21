
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { SiswaMagang } from '@/types/siswaMagang';

const formSchema = z.object({
  siswa_id: z.string().min(1, "Siswa harus dipilih"),
  kumiai_id: z.string().optional(),
  perusahaan_id: z.string().optional(),
  program_id: z.string().optional(),
  jenis_kerja_id: z.string().optional(),
  posisi_kerja_id: z.string().optional(),
  lpk_mitra_id: z.string().optional(),
  demografi_province_id: z.string().optional(),
  demografi_regency_id: z.string().optional(),
  lokasi: z.string().optional(),
  tanggal_mulai_kerja: z.string().optional(),
  tanggal_pulang_kerja: z.string().optional(),
  gaji: z.string().optional().refine((val) => {
    if (!val || val === '') return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Gaji harus berupa angka positif"),
  status_magang: z.string().default('Aktif'),
  avatar_url: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export function useSiswaMagangForm(siswaMagang?: SiswaMagang) {
  console.log('useSiswaMagangForm with siswaMagang:', siswaMagang);

  const defaultValues = {
    siswa_id: siswaMagang?.siswa_id || '',
    kumiai_id: siswaMagang?.kumiai_id || '',
    perusahaan_id: siswaMagang?.perusahaan_id || '',
    program_id: siswaMagang?.program_id || '',
    jenis_kerja_id: siswaMagang?.jenis_kerja_id || '',
    posisi_kerja_id: siswaMagang?.posisi_kerja_id || '',
    lpk_mitra_id: siswaMagang?.lpk_mitra_id || '',
    demografi_province_id: siswaMagang?.demografi_province_id || '',
    demografi_regency_id: siswaMagang?.demografi_regency_id || '',
    lokasi: siswaMagang?.lokasi || '',
    tanggal_mulai_kerja: siswaMagang?.tanggal_mulai_kerja || '',
    tanggal_pulang_kerja: siswaMagang?.tanggal_pulang_kerja || '',
    gaji: siswaMagang?.gaji?.toString() || '',
    status_magang: siswaMagang?.status_magang || 'Aktif',
    avatar_url: siswaMagang?.avatar_url || '',
  };

  console.log('Form default values:', defaultValues);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const formatDataForSubmission = (data: FormData) => {
    console.log('Formatting data for submission:', data);
    
    const formattedData = {
      siswa_id: data.siswa_id && data.siswa_id !== '' ? data.siswa_id : null,
      kumiai_id: data.kumiai_id && data.kumiai_id !== '' ? data.kumiai_id : null,
      perusahaan_id: data.perusahaan_id && data.perusahaan_id !== '' ? data.perusahaan_id : null,
      program_id: data.program_id && data.program_id !== '' ? data.program_id : null,
      jenis_kerja_id: data.jenis_kerja_id && data.jenis_kerja_id !== '' ? data.jenis_kerja_id : null,
      posisi_kerja_id: data.posisi_kerja_id && data.posisi_kerja_id !== '' ? data.posisi_kerja_id : null,
      lpk_mitra_id: data.lpk_mitra_id && data.lpk_mitra_id !== '' ? data.lpk_mitra_id : null,
      demografi_province_id: data.demografi_province_id && data.demografi_province_id !== '' ? data.demografi_province_id : null,
      demografi_regency_id: data.demografi_regency_id && data.demografi_regency_id !== '' ? data.demografi_regency_id : null,
      lokasi: data.lokasi && data.lokasi !== '' ? data.lokasi : null,
      tanggal_mulai_kerja: data.tanggal_mulai_kerja && data.tanggal_mulai_kerja !== '' ? data.tanggal_mulai_kerja : null,
      tanggal_pulang_kerja: data.tanggal_pulang_kerja && data.tanggal_pulang_kerja !== '' ? data.tanggal_pulang_kerja : null,
      gaji: data.gaji && data.gaji !== '' ? parseFloat(data.gaji) : null,
      status_magang: data.status_magang || 'Aktif',
      avatar_url: data.avatar_url && data.avatar_url !== '' ? data.avatar_url : null,
    };

    // Validate required fields
    if (!formattedData.siswa_id) {
      throw new Error('Siswa ID is required');
    }

    console.log('Formatted result:', formattedData);
    return formattedData;
  };

  const resetForm = () => {
    form.reset();
  };

  return {
    form,
    formatDataForSubmission,
    resetForm,
  };
}
