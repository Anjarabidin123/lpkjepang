import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import { authFetch } from '@/lib/api-client';
import { SiswaKeluargaJepang } from './siswa/types';

export function useSiswaKeluargaJepang(siswaId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: keluargaJepang = [], isLoading } = useQuery({
    queryKey: ['siswa-keluarga-jepang', siswaId],
    queryFn: async () => {
      if (!siswaId) return [];
      const response = await authFetch(`${endpoints.siswaKeluargaJepang}?siswa_id=${siswaId}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        siswa_id: item.siswa_id.toString()
      })) as SiswaKeluargaJepang[];
    },
    enabled: !!siswaId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<SiswaKeluargaJepang, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await authFetch(endpoints.siswaKeluargaJepang, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create data');
      }
      const result = await response.json();
      return { ...result, id: result.id.toString(), siswa_id: result.siswa_id.toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-keluarga-jepang', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Data keluarga Jepang berhasil ditambahkan" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<SiswaKeluargaJepang> & { id: string }) => {
      const response = await authFetch(`${endpoints.siswaKeluargaJepang}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to update data');
      const result = await response.json();
      return { ...result, id: result.id.toString(), siswa_id: result.siswa_id.toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-keluarga-jepang', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Data keluarga Jepang berhasil diperbarui" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.siswaKeluargaJepang}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete data');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-keluarga-jepang', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Data keluarga Jepang berhasil dihapus" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    keluargaJepang,
    isLoading,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
