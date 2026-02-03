
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { posisiKerjaTable, perusahaanTable, jenisKerjaTable } from '@/lib/localStorage/tables';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

interface PosisiKerja {
  id: string;
  nama: string;
  kode: string;
  posisi: string;
  deskripsi: string | null;
  lokasi: string | null;
  kuota: number | null;
  terisi: number | null;
  gaji_harian: number | null;
  jam_kerja: string | null;
  persyaratan: string | null;
  status: string | null;
  tanggal_buka: string | null;
  tanggal_tutup: string | null;
  perusahaan_id: string | null;
  jenis_kerja_id: string | null;
  created_at: string;
  updated_at: string;
  perusahaan?: {
    id: string;
    nama: string;
    kode: string;
  } | null;
  jenis_kerja?: {
    id: string;
    nama: string;
    kode: string;
  } | null;
}

type PosisiKerjaInsert = Omit<PosisiKerja, 'id' | 'created_at' | 'updated_at' | 'perusahaan' | 'jenis_kerja'>;
type PosisiKerjaUpdate = Partial<PosisiKerjaInsert>;

export function usePosisiKerja() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posisiKerja, isLoading, error } = useQuery({
    queryKey: ['posisi_kerja'],
    queryFn: async () => {
      console.log('Fetching posisi kerja from Laravel API...');
      const response = await authFetch(endpoints.posisiKerja);
      if (!response.ok) throw new Error('Failed to fetch posisi kerja');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        perusahaan_id: item.perusahaan_id?.toString(),
        jenis_kerja_id: item.jenis_kerja_id?.toString()
      })) as PosisiKerja[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PosisiKerjaInsert) => {
      const response = await authFetch(endpoints.posisiKerja, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menambahkan posisi kerja');
      }
      const result = await response.json();
      return {
        ...result,
        id: result.id.toString(),
        perusahaan_id: result.perusahaan_id?.toString(),
        jenis_kerja_id: result.jenis_kerja_id?.toString()
      } as PosisiKerja;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posisi_kerja'] });
      toast({
        title: "Berhasil",
        description: "Posisi kerja berhasil ditambahkan",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PosisiKerjaUpdate }) => {
      const response = await authFetch(`${endpoints.posisiKerja}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal memperbarui posisi kerja');
      }
      const result = await response.json();
      return {
        ...result,
        id: result.id.toString(),
        perusahaan_id: result.perusahaan_id?.toString(),
        jenis_kerja_id: result.jenis_kerja_id?.toString()
      } as PosisiKerja;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posisi_kerja'] });
      toast({
        title: "Berhasil",
        description: "Posisi kerja berhasil diperbarui",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.posisiKerja}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Gagal menghapus posisi kerja');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posisi_kerja'] });
      toast({
        title: "Berhasil",
        description: "Posisi kerja berhasil dihapus",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    posisiKerja,
    isLoading,
    error,
    createPosisiKerja: createMutation.mutate,
    updatePosisiKerja: updateMutation.mutate,
    deletePosisiKerja: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
