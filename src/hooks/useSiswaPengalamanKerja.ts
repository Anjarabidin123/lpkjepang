import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import { authFetch } from '@/lib/api-client';
import { SiswaPengalamanKerja } from './siswa/types';

export function useSiswaPengalamanKerja(siswaId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pengalamanKerja = [], isLoading } = useQuery({
    queryKey: ['siswa-pengalaman-kerja', siswaId],
    queryFn: async () => {
      if (!siswaId) return [];
      const response = await authFetch(`${endpoints.siswaPengalamanKerja}?siswa_id=${siswaId}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        siswa_id: item.siswa_id.toString()
      })) as SiswaPengalamanKerja[];
    },
    enabled: !!siswaId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<SiswaPengalamanKerja, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await authFetch(endpoints.siswaPengalamanKerja, {
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
      queryClient.invalidateQueries({ queryKey: ['siswa-pengalaman-kerja', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Pengalaman kerja berhasil ditambahkan" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<SiswaPengalamanKerja> & { id: string }) => {
      const response = await authFetch(`${endpoints.siswaPengalamanKerja}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to update data');
      const result = await response.json();
      return { ...result, id: result.id.toString(), siswa_id: result.siswa_id.toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-pengalaman-kerja', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Pengalaman kerja berhasil diperbarui" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.siswaPengalamanKerja}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete data');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-pengalaman-kerja', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Pengalaman kerja berhasil dihapus" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    pengalamanKerja,
    isLoading,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
