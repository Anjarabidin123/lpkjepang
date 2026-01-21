
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SiswaKeluargaIndonesia } from './useSiswa';

export function useSiswaKeluargaIndonesia(siswaId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: keluargaIndonesia = [], isLoading } = useQuery({
    queryKey: ['siswa-keluarga-indonesia', siswaId],
    queryFn: async () => {
      if (!siswaId) return [];
      const { data, error } = await supabase
        .from('siswa_keluarga_indonesia')
        .select('*')
        .eq('siswa_id', siswaId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SiswaKeluargaIndonesia[];
    },
    enabled: !!siswaId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<SiswaKeluargaIndonesia, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('siswa_keluarga_indonesia')
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
      queryClient.invalidateQueries({ queryKey: ['siswa-keluarga-indonesia', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Data keluarga Indonesia berhasil ditambahkan" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<SiswaKeluargaIndonesia> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('siswa_keluarga_indonesia')
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
      queryClient.invalidateQueries({ queryKey: ['siswa-keluarga-indonesia', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Data keluarga Indonesia berhasil diperbarui" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('siswa_keluarga_indonesia')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa-keluarga-indonesia', siswaId] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      toast({ title: "Data keluarga Indonesia berhasil dihapus" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    keluargaIndonesia,
    isLoading,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
