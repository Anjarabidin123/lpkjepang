
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CreateSiswaData, UpdateSiswaData } from './types';

const SISWA_QUERY_KEY = 'siswa';

export function useSiswaMutations() {
  const queryClient = useQueryClient();

  const createSiswa = useMutation({
    mutationFn: async (data: CreateSiswaData) => {
      console.log('Creating siswa with data:', data);
      
      const { data: result, error } = await supabase
        .from('siswa')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('Error creating siswa:', error);
        throw error;
      }

      console.log('Siswa created successfully:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SISWA_QUERY_KEY] });
      toast.success('Siswa berhasil ditambahkan');
    },
    onError: (error) => {
      console.error('Error creating siswa:', error);
      toast.error('Gagal menambahkan siswa');
    },
  });

  const updateSiswa = useMutation({
    mutationFn: async ({ id, ...data }: UpdateSiswaData) => {
      console.log('Updating siswa:', id, 'with data:', data);
      
      const { data: result, error } = await supabase
        .from('siswa')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating siswa:', error);
        throw error;
      }

      console.log('Siswa updated successfully:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SISWA_QUERY_KEY] });
      toast.success('Siswa berhasil diperbarui');
    },
    onError: (error) => {
      console.error('Error updating siswa:', error);
      toast.error('Gagal memperbarui siswa');
    },
  });

  const deleteSiswa = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting siswa:', id);
      
      const { error } = await supabase
        .from('siswa')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting siswa:', error);
        throw error;
      }

      console.log('Siswa deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SISWA_QUERY_KEY] });
      toast.success('Siswa berhasil dihapus');
    },
    onError: (error) => {
      console.error('Error deleting siswa:', error);
      toast.error('Gagal menghapus siswa');
    },
  });

  return {
    createSiswa: createSiswa.mutate,
    updateSiswa: updateSiswa.mutate,
    deleteSiswa: deleteSiswa.mutate,
    isCreating: createSiswa.isPending,
    isUpdating: updateSiswa.isPending,
    isDeleting: deleteSiswa.isPending,
  };
}
