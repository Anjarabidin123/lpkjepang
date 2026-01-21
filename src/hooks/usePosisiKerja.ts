
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { posisiKerjaTable, perusahaanTable, jenisKerjaTable } from '@/lib/localStorage/tables';
import { useToast } from '@/hooks/use-toast';

interface PosisiKerja {
  id: string;
  nama: string;
  kode: string;
  deskripsi: string | null;
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
      console.log('Fetching posisi kerja from localStorage...');
      const posisiData = posisiKerjaTable.getAll() as PosisiKerja[];
      const perusahaanData = perusahaanTable.getAll() as any[];
      const jenisKerjaData = jenisKerjaTable.getAll() as any[];

      // Join relations
      const processedData = posisiData.map(item => ({
        ...item,
        perusahaan: item.perusahaan_id 
          ? perusahaanData.find(p => p.id === item.perusahaan_id) 
            ? { id: perusahaanData.find(p => p.id === item.perusahaan_id)!.id, nama: perusahaanData.find(p => p.id === item.perusahaan_id)!.nama, kode: perusahaanData.find(p => p.id === item.perusahaan_id)!.kode }
            : null
          : null,
        jenis_kerja: item.jenis_kerja_id
          ? jenisKerjaData.find(j => j.id === item.jenis_kerja_id)
            ? { id: jenisKerjaData.find(j => j.id === item.jenis_kerja_id)!.id, nama: jenisKerjaData.find(j => j.id === item.jenis_kerja_id)!.nama, kode: jenisKerjaData.find(j => j.id === item.jenis_kerja_id)!.kode }
            : null
          : null,
      }));

      console.log('Posisi kerja fetched successfully:', processedData.length, 'records');
      return processedData;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createMutation = useMutation({
    mutationFn: async (data: PosisiKerjaInsert) => {
      const result = posisiKerjaTable.create(data);
      return result as PosisiKerja;
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
      const result = posisiKerjaTable.update(id, data);
      if (!result) throw new Error('Posisi kerja tidak ditemukan');
      return result as PosisiKerja;
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
      const success = posisiKerjaTable.delete(id);
      if (!success) throw new Error('Gagal menghapus posisi kerja');
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
