
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { DemografiProvince, CreateDemografiProvinceData, UpdateDemografiProvinceData } from '@/types/demografi';

const PROVINCES_QUERY_KEY = 'demografi-provinces';

export function useDemografiProvinces(countryId?: string) {
  const queryClient = useQueryClient();

  const {
    data: provinces = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [PROVINCES_QUERY_KEY, countryId],
    queryFn: async (): Promise<DemografiProvince[]> => {
      let query = supabase
        .from('demografi_provinces')
        .select(`
          *,
          country:demografi_countries(*)
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('nama', { ascending: true });

      if (countryId) {
        query = query.eq('country_id', countryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching provinces:', error);
        throw new Error(`Failed to fetch provinces: ${error.message}`);
      }

      return data as DemografiProvince[];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createProvince = useMutation({
    mutationFn: async (data: CreateDemografiProvinceData) => {
      const { data: result, error } = await supabase
        .from('demografi_provinces')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROVINCES_QUERY_KEY] });
      toast.success('Provinsi berhasil ditambahkan');
    },
    onError: (error) => {
      console.error('Error creating province:', error);
      toast.error('Gagal menambahkan provinsi');
    },
  });

  const updateProvince = useMutation({
    mutationFn: async ({ id, ...data }: UpdateDemografiProvinceData) => {
      const { data: result, error } = await supabase
        .from('demografi_provinces')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROVINCES_QUERY_KEY] });
      toast.success('Provinsi berhasil diperbarui');
    },
    onError: (error) => {
      console.error('Error updating province:', error);
      toast.error('Gagal memperbarui provinsi');
    },
  });

  const deleteProvince = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('demografi_provinces')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROVINCES_QUERY_KEY] });
      toast.success('Provinsi berhasil dihapus');
    },
    onError: (error) => {
      console.error('Error deleting province:', error);
      toast.error('Gagal menghapus provinsi');
    },
  });

  return {
    provinces,
    isLoading,
    error,
    refetch,
    createProvince: createProvince.mutate,
    updateProvince: updateProvince.mutate,
    deleteProvince: deleteProvince.mutate,
    isCreating: createProvince.isPending,
    isUpdating: updateProvince.isPending,
    isDeleting: deleteProvince.isPending,
  };
}
