import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export interface SiswaPendidikan {
  id: string;
  siswa_id: string;
  jenjang_pendidikan: string;
  nama_institusi: string;
  jurusan: string | null;
  tahun_masuk: number | null;
  tahun_lulus: number | null;
  nilai_akhir: string | null;
  sertifikat_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useSiswaPendidikan(siswaId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendidikan = [], isLoading, error, refetch } = useQuery({
    queryKey: ['siswa-pendidikan', siswaId],
    queryFn: async () => {
      const response = await authFetch(`${endpoints.siswaPendidikan}?siswa_id=${siswaId}`);
      if (!response.ok) throw new Error('Failed to fetch pendidikan data');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        siswa_id: item.siswa_id.toString()
      })) as SiswaPendidikan[];
    },
    enabled: !!siswaId
  });

  const createMutation = useMutation({
    mutationFn: async (newPendidikan: Omit<SiswaPendidikan, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await authFetch(endpoints.siswaPendidikan, {
        method: 'POST',
        body: JSON.stringify(newPendidikan)
      });
      if (!response.ok) throw new Error('Failed to create pendidikan');
      const data = await response.json();
      return { ...data, id: data.id.toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-pendidikan', siswaId] });
      toast({ title: "Informasi pendidikan berhasil ditambahkan" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menambah informasi pendidikan",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SiswaPendidikan> & { id: string }) => {
      const response = await authFetch(`${endpoints.siswaPendidikan}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update pendidikan');
      const data = await response.json();
      return { ...data, id: data.id.toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-pendidikan', siswaId] });
      toast({ title: "Informasi pendidikan berhasil diperbarui" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal memperbarui informasi pendidikan",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.siswaPendidikan}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete pendidikan');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-pendidikan', siswaId] });
      toast({ title: "Informasi pendidikan berhasil dihapus" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus informasi pendidikan",
        variant: "destructive"
      });
    }
  });

  return {
    pendidikan,
    isLoading,
    error,
    refetch,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
