
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { perusahaanTable, kumiaiTable } from '@/lib/localStorage/tables';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

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
      console.log('Fetching perusahaan from Laravel API...');
      const response = await authFetch(endpoints.perusahaan);
      if (!response.ok) throw new Error('Failed to fetch perusahaan');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        kumiai_id: item.kumiai_id?.toString()
      })) as Perusahaan[];
    },
    retry: 3,
  });

  const createMutation = useMutation({
    mutationFn: async (data: PerusahaanInsert) => {
      const response = await authFetch(endpoints.perusahaan, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create perusahaan');
      const result = await response.json();
      return {
        ...result,
        id: result.id.toString(),
        kumiai_id: result.kumiai_id?.toString()
      } as Perusahaan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perusahaan'] });
      queryClient.invalidateQueries({ queryKey: ['kumiai'] });
      toast({
        title: "Berhasil",
        description: "Perusahaan berhasil ditambahkan",
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
    mutationFn: async ({ id, data }: { id: string; data: PerusahaanUpdate }) => {
      const response = await authFetch(`${endpoints.perusahaan}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update perusahaan');
      const result = await response.json();
      return {
        ...result,
        id: result.id.toString(),
        kumiai_id: result.kumiai_id?.toString()
      } as Perusahaan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perusahaan'] });
      queryClient.invalidateQueries({ queryKey: ['kumiai'] });
      toast({
        title: "Berhasil",
        description: "Perusahaan berhasil diperbarui",
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
      const response = await authFetch(`${endpoints.perusahaan}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Gagal menghapus perusahaan');
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
