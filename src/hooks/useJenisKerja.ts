
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jenisKerjaTable } from '@/lib/localStorage/tables';
import { useToast } from '@/hooks/use-toast';

interface JenisKerja {
  id: string;
  nama: string;
  kode: string;
  deskripsi: string | null;
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
      console.log('Fetching jenis kerja from localStorage...');
      const data = jenisKerjaTable.getAll();
      return data as JenisKerja[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: JenisKerjaInsert) => {
      const result = jenisKerjaTable.create(data);
      return result as JenisKerja;
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
      const result = jenisKerjaTable.update(id, data);
      if (!result) throw new Error('Jenis kerja tidak ditemukan');
      return result as JenisKerja;
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
      const success = jenisKerjaTable.delete(id);
      if (!success) throw new Error('Gagal menghapus jenis kerja');
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
