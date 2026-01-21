
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kumiaiTable, perusahaanTable } from '@/lib/localStorage/tables';
import { useToast } from '@/hooks/use-toast';

export interface Kumiai {
  id: string;
  nama: string;
  kode: string;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  pic_nama: string | null;
  pic_telepon: string | null;
  jumlah_perusahaan: number | null;
  tanggal_kerjasama: string | null;
  created_at: string;
  updated_at: string;
  perusahaan?: Array<{
    id: string;
    nama: string;
    kode: string;
    alamat: string | null;
    telepon: string | null;
    email: string | null;
    bidang_usaha: string | null;
    kapasitas: number | null;
    tanggal_kerjasama: string | null;
  }>;
}

export function useKumiai() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kumiai = [], isLoading, error, refetch } = useQuery({
    queryKey: ['kumiai'],
    queryFn: async () => {
      console.log('Fetching kumiai from localStorage...');
      const kumiaiData = kumiaiTable.getAll() as Kumiai[];
      const perusahaanData = perusahaanTable.getAll() as any[];

      // Join perusahaan to kumiai
      const processedData = kumiaiData.map(item => {
        const relatedPerusahaan = perusahaanData.filter(p => p.kumiai_id === item.id);
        return {
          ...item,
          jumlah_perusahaan: relatedPerusahaan.length,
          perusahaan: relatedPerusahaan,
        };
      });

      console.log('Kumiai fetched successfully:', processedData.length, 'records');
      return processedData;
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: async (newKumiai: Omit<Kumiai, 'id' | 'created_at' | 'updated_at' | 'perusahaan'>) => {
      console.log('Creating kumiai:', newKumiai);
      const kumiaiData = {
        ...newKumiai,
        jumlah_perusahaan: 0,
      };
      const data = kumiaiTable.create(kumiaiData);
      return { ...data, perusahaan: [] } as Kumiai;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['kumiai'], (oldData: Kumiai[] | undefined) => {
        return oldData ? [data, ...oldData] : [data];
      });
      queryClient.invalidateQueries({ queryKey: ['kumiai'] });
      toast({ title: "Kumiai berhasil ditambahkan" });
    },
    onError: (error: Error) => {
      console.error('Kumiai creation failed:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Gagal menambah kumiai", 
        variant: "destructive" 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Kumiai> & { id: string }) => {
      console.log('Updating kumiai:', id, updates);
      const { created_at, updated_at, perusahaan, ...updateData } = updates;
      const data = kumiaiTable.update(id, updateData);
      if (!data) throw new Error('Kumiai tidak ditemukan');
      
      const perusahaanData = perusahaanTable.getAll() as any[];
      const relatedPerusahaan = perusahaanData.filter(p => p.kumiai_id === id);
      
      return { ...data, perusahaan: relatedPerusahaan } as Kumiai;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['kumiai'], (oldData: Kumiai[] | undefined) => {
        return oldData?.map(item => item.id === data.id ? data : item) || [];
      });
      queryClient.invalidateQueries({ queryKey: ['kumiai'] });
      toast({ title: "Kumiai berhasil diperbarui" });
    },
    onError: (error: Error) => {
      console.error('Kumiai update failed:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Gagal memperbarui kumiai", 
        variant: "destructive" 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting kumiai:', id);
      const success = kumiaiTable.delete(id);
      if (!success) throw new Error('Gagal menghapus kumiai');
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['kumiai'], (oldData: Kumiai[] | undefined) => {
        return oldData?.filter(item => item.id !== deletedId) || [];
      });
      queryClient.invalidateQueries({ queryKey: ['kumiai'] });
      toast({ title: "Kumiai berhasil dihapus" });
    },
    onError: (error: Error) => {
      console.error('Kumiai deletion failed:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Gagal menghapus kumiai", 
        variant: "destructive" 
      });
    }
  });

  return {
    kumiai,
    isLoading,
    error,
    refetch,
    createKumiai: createMutation.mutate,
    updateKumiai: updateMutation.mutate,
    deleteKumiai: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
