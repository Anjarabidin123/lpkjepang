
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SiswaPengalamanKerja } from './useSiswa';

export function useSiswaPengalamanKerja(siswaId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pengalamanKerja = [], isLoading } = useQuery({
    queryKey: ['siswa-pengalaman-kerja', siswaId],
    queryFn: async () => {
      if (!siswaId) return [];
      const { data, error } = await supabase
        .from('siswa_pengalaman_kerja')
        .select('*')
        .eq('siswa_id', siswaId)
        .order('tahun_masuk', { ascending: false });
      
      if (error) throw error;
      return data as SiswaPengalamanKerja[];
    },
    enabled: !!siswaId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<SiswaPengalamanKerja, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('siswa_pengalaman_kerja')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
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
      const { data: result, error } = await supabase
        .from('siswa_pengalaman_kerja')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
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
      const { error } = await supabase
        .from('siswa_pengalaman_kerja')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
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
