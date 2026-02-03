
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { kumiaiTable, perusahaanTable } from '@/lib/localStorage/tables';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

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
      console.log('Fetching kumiai from Laravel API...');
      try {
        const response = await authFetch(endpoints.kumiai);
        if (!response.ok) throw new Error('Failed to fetch kumiai');
        const data = await response.json();

        // Calculate jumlah_perusahaan if present or default to 0
        const processedData = data.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          jumlah_perusahaan: item.perusahaan ? item.perusahaan.length : 0,
          perusahaan: item.perusahaan?.map((p: any) => ({ ...p, id: p.id.toString(), kumiai_id: p.kumiai_id?.toString() }))
        }));

        return processedData;
      } catch (err) {
        console.error("Fetch kumiai error", err);
        return [];
      }
    },
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: async (newKumiai: Omit<Kumiai, 'id' | 'created_at' | 'updated_at' | 'perusahaan'>) => {
      console.log('Creating kumiai via API:', newKumiai);
      const response = await authFetch(endpoints.kumiai, {
        method: 'POST',
        body: JSON.stringify(newKumiai)
      });
      if (!response.ok) throw new Error('Failed to create kumiai');
      const data = await response.json();
      return {
        ...data,
        id: data.id.toString(),
        perusahaan: data.perusahaan?.map((p: any) => ({ ...p, id: p.id.toString(), kumiai_id: p.kumiai_id?.toString() }))
      };
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
      console.log('Updating kumiai via API:', id);
      const { created_at, updated_at, perusahaan, ...updateData } = updates;

      const response = await authFetch(`${endpoints.kumiai}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update kumiai');
      const data = await response.json();
      return {
        ...data,
        id: data.id.toString(),
        perusahaan: data.perusahaan?.map((p: any) => ({ ...p, id: p.id.toString(), kumiai_id: p.kumiai_id?.toString() }))
      };
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
      console.log('Deleting kumiai via API:', id);
      const response = await authFetch(`${endpoints.kumiai}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete kumiai');
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
