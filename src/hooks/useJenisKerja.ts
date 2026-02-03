
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

interface JenisKerja {
  id: string;
  nama: string;
  kode: string;
  deskripsi: string | null;
  kategori: string | null;
  tingkat_kesulitan: string | null;
  syarat_pendidikan: string | null;
  gaji_minimal: number | null;
  gaji_maksimal: number | null;
  total_posisi: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

type JenisKerjaInsert = Omit<JenisKerja, 'id' | 'created_at' | 'updated_at'>;
type JenisKerjaUpdate = Partial<JenisKerjaInsert>;

export function useJenisKerja() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jenisKerja, isLoading, error } = useQuery({
    queryKey: ['jenis_kerja'],
    queryFn: async () => {
      console.log('Fetching jenis kerja from Laravel API...');
      const response = await authFetch(endpoints.jenisKerja);
      if (!response.ok) throw new Error('Failed to fetch jenis kerja');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString()
      })) as JenisKerja[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: JenisKerjaInsert) => {
      const response = await authFetch(endpoints.jenisKerja, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menambahkan jenis kerja');
      }
      const result = await response.json();
      return {
        ...result,
        id: result.id.toString()
      } as JenisKerja;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenis_kerja'] });
      toast({
        title: "Berhasil",
        description: "Jenis kerja berhasil ditambahkan",
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
    mutationFn: async ({ id, data }: { id: string; data: JenisKerjaUpdate }) => {
      const response = await authFetch(`${endpoints.jenisKerja}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal memperbarui jenis kerja');
      }
      const result = await response.json();
      return {
        ...result,
        id: result.id.toString()
      } as JenisKerja;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenis_kerja'] });
      toast({
        title: "Berhasil",
        description: "Jenis kerja berhasil diperbarui",
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
      const response = await authFetch(`${endpoints.jenisKerja}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Gagal menghapus jenis kerja');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenis_kerja'] });
      toast({
        title: "Berhasil",
        description: "Jenis kerja berhasil dihapus",
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
    jenisKerja,
    isLoading,
    error,
    createJenisKerja: createMutation.mutate,
    updateJenisKerja: updateMutation.mutate,
    deleteJenisKerja: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
