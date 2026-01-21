
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SiswaKontakKeluarga } from './useSiswa';

export function useSiswaKontakKeluarga(siswaId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kontakKeluarga = [], isLoading } = useQuery({
    queryKey: ['siswa-kontak-keluarga', siswaId],
    queryFn: async () => {
      if (!siswaId) return [];
      const { data, error } = await supabase
        .from('siswa_kontak_keluarga')
        .select('*')
        .eq('siswa_id', siswaId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SiswaKontakKeluarga[];
    },
    enabled: !!siswaId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<SiswaKontakKeluarga, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('siswa_kontak_keluarga')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-kontak-keluarga', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Kontak keluarga berhasil ditambahkan" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<SiswaKontakKeluarga> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('siswa_kontak_keluarga')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-kontak-keluarga', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Kontak keluarga berhasil diperbarui" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('siswa_kontak_keluarga')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-kontak-keluarga', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Kontak keluarga berhasil dihapus" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    kontakKeluarga,
    isLoading,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
