import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export interface Pengeluaran {
  id: string;
  kategori_id?: string;
  nama_pengeluaran: string;
  nominal: number;
  tanggal_pengeluaran: string;
  keterangan?: string;
  created_at: string;
  updated_at: string;
  kategori_pengeluaran?: {
    id: string;
    nama_kategori: string;
  };
}

export function usePengeluaran() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading: loading } = useQuery({
    queryKey: ['pengeluaran'],
    queryFn: async () => {
      const response = await authFetch(endpoints.pengeluaran);
      if (!response.ok) throw new Error('Failed to fetch expense data');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        kategori_id: item.kategori_id?.toString(),
        nominal: Number(item.nominal) || 0,
        kategori_pengeluaran: item.kategori ? {
          id: item.kategori.id.toString(),
          nama_kategori: item.kategori.nama_kategori
        } : undefined
      })) as Pengeluaran[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Pengeluaran, 'id' | 'created_at' | 'updated_at' | 'kategori_pengeluaran'>) => {
      const response = await authFetch(endpoints.pengeluaran, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create expense record');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      toast({ title: "Success", description: "Expense record created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Pengeluaran>) => {
      const response = await authFetch(`${endpoints.pengeluaran}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update expense record');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      toast({ title: "Success", description: "Expense record updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.pengeluaran}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete expense record');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengeluaran'] });
      toast({ title: "Success", description: "Expense record deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    expenses,
    loading,
    createExpense: createMutation.mutateAsync,
    updateExpense: (id: string, data: any) => updateMutation.mutateAsync({ id, ...data }),
    deleteExpense: deleteMutation.mutateAsync,
    fetchExpenses: () => queryClient.invalidateQueries({ queryKey: ['pengeluaran'] }),
  };
}
