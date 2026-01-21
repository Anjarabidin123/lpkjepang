
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { DemografiRegency, CreateDemografiRegencyData, UpdateDemografiRegencyData } from '@/types/demografi';

const REGENCIES_QUERY_KEY = 'demografi-regencies';

export function useDemografiRegencies(provinceId?: string) {
  const queryClient = useQueryClient();

  const {
    data: regencies = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [REGENCIES_QUERY_KEY, provinceId],
    queryFn: async (): Promise<DemografiRegency[]> => {
      let query = supabase
        .from('demografi_regencies')
        .select(`
          *,
          province:demografi_provinces(
            *,
            country:demografi_countries(*)
          )
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('nama', { ascending: true });

      if (provinceId) {
        query = query.eq('province_id', provinceId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching regencies:', error);
        throw new Error(`Failed to fetch regencies: ${error.message}`);
      }

      return data as DemografiRegency[];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createRegency = useMutation({
    mutationFn: async (data: CreateDemografiRegencyData) => {
      const { data: result, error } = await supabase
        .from('demografi_regencies')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGENCIES_QUERY_KEY] });
      toast.success('Kabupaten berhasil ditambahkan');
    },
    onError: (error) => {
      console.error('Error creating regency:', error);
      toast.error('Gagal menambahkan kabupaten');
    },
  });

  const updateRegency = useMutation({
    mutationFn: async ({ id, ...data }: UpdateDemografiRegencyData) => {
      const { data: result, error } = await supabase
        .from('demografi_regencies')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGENCIES_QUERY_KEY] });
      toast.success('Kabupaten berhasil diperbarui');
    },
    onError: (error) => {
      console.error('Error updating regency:', error);
      toast.error('Gagal memperbarui kabupaten');
    },
  });

  const deleteRegency = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('demografi_regencies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGENCIES_QUERY_KEY] });
      toast.success('Kabupaten berhasil dihapus');
    },
    onError: (error) => {
      console.error('Error deleting regency:', error);
      toast.error('Gagal menghapus kabupaten');
    },
  });

  return {
    regencies,
    isLoading,
    error,
    refetch,
    createRegency: createRegency.mutate,
    updateRegency: updateRegency.mutate,
    deleteRegency: deleteRegency.mutate,
    isCreating: createRegency.isPending,
    isUpdating: updateRegency.isPending,
    isDeleting: deleteRegency.isPending,
  };
}
