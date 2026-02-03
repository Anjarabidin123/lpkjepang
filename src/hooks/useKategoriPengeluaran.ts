import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export interface KategoriPengeluaran {
  id: string;
  nama_kategori: string;
  deskripsi?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useKategoriPengeluaran() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: loading } = useQuery({
    queryKey: ['kategori-pengeluaran'],
    queryFn: async () => {
      const response = await authFetch(endpoints.kategoriPengeluaran);
      if (!response.ok) throw new Error('Failed to fetch expense categories');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString()
      })) as KategoriPengeluaran[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<KategoriPengeluaran, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await authFetch(endpoints.kategoriPengeluaran, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create expense category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-pengeluaran'] });
      toast({ title: "Success", description: "Category created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<KategoriPengeluaran>) => {
      const response = await authFetch(`${endpoints.kategoriPengeluaran}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-pengeluaran'] });
      toast({ title: "Success", description: "Category updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.kategoriPengeluaran}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete category');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-pengeluaran'] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    categories,
    loading,
    createCategory: createMutation.mutateAsync,
    updateCategory: (id: string, data: any) => updateMutation.mutateAsync({ id, ...data }),
    deleteCategory: deleteMutation.mutateAsync,
    fetchCategories: () => queryClient.invalidateQueries({ queryKey: ['kategori-pengeluaran'] }),
  };
}
