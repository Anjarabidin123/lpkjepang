
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { perusahaanTable, kumiaiTable } from '@/lib/localStorage/tables';
import { useToast } from '@/hooks/use-toast';

interface Perusahaan {
  id: string;
  nama: string;
  kode: string;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  bidang_usaha: string | null;
  kapasitas: number | null;
  tanggal_kerjasama: string | null;
  kumiai_id: string | null;
  created_at: string;
  updated_at: string;
  kumiai?: {
    id: string;
    nama: string;
    kode: string;
  } | null;
}

type PerusahaanInsert = Omit<Perusahaan, 'id' | 'created_at' | 'updated_at' | 'kumiai'>;
type PerusahaanUpdate = Partial<PerusahaanInsert>;

export function usePerusahaan() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: perusahaan, isLoading, error } = useQuery({
    queryKey: ['perusahaan'],
    queryFn: async () => {
      console.log('Fetching perusahaan from localStorage...');
      const perusahaanData = perusahaanTable.getAll() as Perusahaan[];
      const kumiaiData = kumiaiTable.getAll() as any[];

      // Join kumiai to perusahaan
      const processedData = perusahaanData.map(item => {
        const relatedKumiai = kumiaiData.find(k => k.id === item.kumiai_id);
        return {
          ...item,
          kumiai: relatedKumiai ? {
            id: relatedKumiai.id,
            nama: relatedKumiai.nama,
            kode: relatedKumiai.kode,
          } : null,
        };
      });

      console.log('Perusahaan fetched successfully:', processedData.length, 'records');
      return processedData;
    },
    retry: 3,
  });

  const createMutation = useMutation({
    mutationFn: async (data: PerusahaanInsert) => {
      console.log('Creating perusahaan:', data);
      const result = perusahaanTable.create(data);
      
      // Get related kumiai
      if (result.kumiai_id) {
        const kumiaiData = kumiaiTable.getById(result.kumiai_id);
        return {
          ...result,
          kumiai: kumiaiData ? {
            id: kumiaiData.id,
            nama: kumiaiData.nama,
            kode: kumiaiData.kode,
          } : null,
        } as Perusahaan;
      }
      
      return { ...result, kumiai: null } as Perusahaan;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['perusahaan'] });
      queryClient.invalidateQueries({ queryKey: ['kumiai'] });
      toast({
        title: "Berhasil",
        description: "Perusahaan berhasil ditambahkan",
      });
    },
    onError: (error: Error) => {
      console.error('Perusahaan creation failed:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PerusahaanUpdate }) => {
      console.log('Updating perusahaan:', id, data);
      const result = perusahaanTable.update(id, data);
      if (!result) throw new Error('Perusahaan tidak ditemukan');
      
      // Get related kumiai
      if (result.kumiai_id) {
        const kumiaiData = kumiaiTable.getById(result.kumiai_id);
        return {
          ...result,
          kumiai: kumiaiData ? {
            id: kumiaiData.id,
            nama: kumiaiData.nama,
            kode: kumiaiData.kode,
          } : null,
        } as Perusahaan;
      }
      
      return { ...result, kumiai: null } as Perusahaan;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['perusahaan'] });
      queryClient.invalidateQueries({ queryKey: ['kumiai'] });
      toast({
        title: "Berhasil",
        description: "Perusahaan berhasil diperbarui",
      });
    },
    onError: (error: Error) => {
      console.error('Perusahaan update failed:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting perusahaan:', id);
      const success = perusahaanTable.delete(id);
      if (!success) throw new Error('Gagal menghapus perusahaan');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perusahaan'] });
      queryClient.invalidateQueries({ queryKey: ['kumiai'] });
      toast({
        title: "Berhasil",
        description: "Perusahaan berhasil dihapus",
      });
    },
    onError: (error: Error) => {
      console.error('Perusahaan deletion failed:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    perusahaan,
    isLoading,
    error,
    createPerusahaan: createMutation.mutate,
    updatePerusahaan: updateMutation.mutate,
    deletePerusahaan: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
