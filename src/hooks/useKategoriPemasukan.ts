import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export interface KategoriPemasukan {
  id: string;
  nama_kategori: string;
  deskripsi?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useKategoriPemasukan() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: loading } = useQuery({
    queryKey: ['kategori-pemasukan'],
    queryFn: async () => {
      const response = await authFetch(endpoints.kategoriPemasukan);
      if (!response.ok) throw new Error('Failed to fetch income categories');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString()
      })) as KategoriPemasukan[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<KategoriPemasukan, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await authFetch(endpoints.kategoriPemasukan, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create income category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-pemasukan'] });
      toast({ title: "Success", description: "Income category created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<KategoriPemasukan>) => {
      const response = await authFetch(`${endpoints.kategoriPemasukan}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update income category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-pemasukan'] });
      toast({ title: "Success", description: "Income category updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.kategoriPemasukan}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete income category');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-pemasukan'] });
      toast({ title: "Success", description: "Income category deleted successfully" });
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
    fetchCategories: () => queryClient.invalidateQueries({ queryKey: ['kategori-pemasukan'] }),
  };
}
