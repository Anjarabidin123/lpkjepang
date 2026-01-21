
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SiswaKeluargaJepang } from './useSiswa';

export function useSiswaKeluargaJepang(siswaId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: keluargaJepang = [], isLoading } = useQuery({
    queryKey: ['siswa-keluarga-jepang', siswaId],
    queryFn: async () => {
      if (!siswaId) return [];
      const { data, error } = await supabase
        .from('siswa_keluarga_jepang')
        .select('*')
        .eq('siswa_id', siswaId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SiswaKeluargaJepang[];
    },
    enabled: !!siswaId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<SiswaKeluargaJepang, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('siswa_keluarga_jepang')
        .insert([{
          siswa_id: data.siswa_id,
          nama: data.nama,
          hubungan: data.hubungan as any,
          umur: data.umur,
          pekerjaan: data.pekerjaan,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
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
      const { data: result, error } = await supabase
        .from('siswa_keluarga_jepang')
        .update({
          nama: data.nama,
          hubungan: data.hubungan as any,
          umur: data.umur,
          pekerjaan: data.pekerjaan,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
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
      const { error } = await supabase
        .from('siswa_keluarga_jepang')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
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
