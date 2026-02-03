import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export function useArusKas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: arusKasList = [], isLoading: loading } = useQuery({
    queryKey: ['arus-kas'],
    queryFn: async () => {
      const response = await authFetch(endpoints.arusKas);
      if (!response.ok) throw new Error('Failed to fetch arus kas');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        nominal: Number(item.nominal) || 0
      }));
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await authFetch(endpoints.arusKas, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create transaction');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arus-kas'] });
      toast({ title: "Berhasil", description: "Transaksi berhasil ditambahkan" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & any) => {
      const response = await authFetch(`${endpoints.arusKas}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arus-kas'] });
      toast({ title: "Berhasil", description: "Transaksi berhasil diperbarui" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.arusKas}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arus-kas'] });
      toast({ title: "Berhasil", description: "Transaksi berhasil dihapus" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const getArusKasById = (id: string) => {
    return arusKasList.find((item: any) => item.id === id) || null;
  };

  return {
    arusKasList,
    loading,
    createArusKas: createMutation.mutateAsync,
    updateArusKas: (id: string, data: any) => updateMutation.mutateAsync({ id, ...data }),
    deleteArusKas: deleteMutation.mutateAsync,
    getArusKasById,
    fetchArusKas: () => queryClient.invalidateQueries({ queryKey: ['arus-kas'] }),
  };
}
