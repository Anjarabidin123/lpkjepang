
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      const { data, error } = await supabase
        .from('siswa_pendidikan')
        .select('*')
        .eq('siswa_id', siswaId)
        .order('tahun_masuk', { ascending: false });
      
      if (error) throw error;
      return data as SiswaPendidikan[];
    },
    enabled: !!siswaId
  });

  const createMutation = useMutation({
    mutationFn: async (newPendidikan: Omit<SiswaPendidikan, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('siswa_pendidikan')
        .insert([newPendidikan])
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('siswa_pendidikan')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('siswa_pendidikan')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
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
