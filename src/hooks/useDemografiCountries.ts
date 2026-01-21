
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { DemografiCountry, CreateDemografiCountryData, UpdateDemografiCountryData } from '@/types/demografi';

const COUNTRIES_QUERY_KEY = 'demografi-countries';

export function useDemografiCountries() {
  const queryClient = useQueryClient();

  const {
    data: countries = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [COUNTRIES_QUERY_KEY],
    queryFn: async (): Promise<DemografiCountry[]> => {
      const { data, error } = await supabase
        .from('demografi_countries')
        .select('*')
        .eq('is_active', true)
        .order('nama', { ascending: true });

      if (error) {
        console.error('Error fetching countries:', error);
        throw new Error(`Failed to fetch countries: ${error.message}`);
      }

      return data as DemografiCountry[];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createCountry = useMutation({
    mutationFn: async (data: CreateDemografiCountryData) => {
      const { data: result, error } = await supabase
        .from('demografi_countries')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUNTRIES_QUERY_KEY] });
      toast.success('Negara berhasil ditambahkan');
    },
    onError: (error) => {
      console.error('Error creating country:', error);
      toast.error('Gagal menambahkan negara');
    },
  });

  const updateCountry = useMutation({
    mutationFn: async ({ id, ...data }: UpdateDemografiCountryData) => {
      const { data: result, error } = await supabase
        .from('demografi_countries')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUNTRIES_QUERY_KEY] });
      toast.success('Negara berhasil diperbarui');
    },
    onError: (error) => {
      console.error('Error updating country:', error);
      toast.error('Gagal memperbarui negara');
    },
  });

  const deleteCountry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('demografi_countries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUNTRIES_QUERY_KEY] });
      toast.success('Negara berhasil dihapus');
    },
    onError: (error) => {
      console.error('Error deleting country:', error);
      toast.error('Gagal menghapus negara');
    },
  });

  return {
    countries,
    isLoading,
    error,
    refetch,
    createCountry: createCountry.mutate,
    updateCountry: updateCountry.mutate,
    deleteCountry: deleteCountry.mutate,
    isCreating: createCountry.isPending,
    isUpdating: updateCountry.isPending,
    isDeleting: deleteCountry.isPending,
  };
}
