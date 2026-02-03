import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export function useItemPembayaran() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: itemPembayaranList = [], isLoading: loading } = useQuery({
    queryKey: ['item-pembayaran'],
    queryFn: async () => {
      const response = await authFetch(endpoints.itemPembayaran);
      if (!response.ok) throw new Error('Failed to fetch item pembayaran');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        nominal_wajib: Number(item.nominal_wajib) || 0
      }));
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await authFetch(endpoints.itemPembayaran, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create item pembayaran');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-pembayaran'] });
      toast({ title: "Berhasil", description: "Item pembayaran berhasil ditambahkan" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & any) => {
      const response = await authFetch(`${endpoints.itemPembayaran}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update item pembayaran');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-pembayaran'] });
      toast({ title: "Berhasil", description: "Item pembayaran berhasil diperbarui" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.itemPembayaran}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete item pembayaran');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-pembayaran'] });
      toast({ title: "Berhasil", description: "Item pembayaran berhasil dihapus" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    itemPembayaranList,
    loading,
    createItemPembayaran: createMutation.mutateAsync,
    updateItemPembayaran: (id: string, data: any) => updateMutation.mutateAsync({ id, ...data }),
    deleteItemPembayaran: deleteMutation.mutateAsync,
    fetchItemPembayaran: () => queryClient.invalidateQueries({ queryKey: ['item-pembayaran'] }),
  };
}
