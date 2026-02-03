import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export interface Pemasukan {
  id: string;
  kategori_id?: string;
  nama_pemasukan: string;
  nominal: number;
  tanggal_pemasukan: string;
  keterangan?: string;
  created_at: string;
  updated_at: string;
  kategori_pemasukan?: {
    id: string;
    nama_kategori: string;
  };
}

export function usePemasukan() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: incomes = [], isLoading: loading } = useQuery({
    queryKey: ['pemasukan'],
    queryFn: async () => {
      const response = await authFetch(endpoints.pemasukan);
      if (!response.ok) throw new Error('Failed to fetch income data');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        kategori_id: item.kategori_id?.toString(),
        nominal: Number(item.nominal) || 0,
        kategori_pemasukan: item.kategori ? {
          id: item.kategori.id.toString(),
          nama_kategori: item.kategori.nama_kategori
        } : undefined
      })) as Pemasukan[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Pemasukan, 'id' | 'created_at' | 'updated_at' | 'kategori_pemasukan'>) => {
      const response = await authFetch(endpoints.pemasukan, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create income record');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pemasukan'] });
      toast({ title: "Success", description: "Income record created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Pemasukan>) => {
      const response = await authFetch(`${endpoints.pemasukan}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update income record');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pemasukan'] });
      toast({ title: "Success", description: "Income record updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.pemasukan}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete income record');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pemasukan'] });
      toast({ title: "Success", description: "Income record deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    incomes,
    loading,
    createIncome: createMutation.mutateAsync,
    updateIncome: (id: string, data: any) => updateMutation.mutateAsync({ id, ...data }),
    deleteIncome: deleteMutation.mutateAsync,
    fetchIncomes: () => queryClient.invalidateQueries({ queryKey: ['pemasukan'] }),
  };
}
