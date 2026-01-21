
import { useQuery } from '@tanstack/react-query';
import { siswaService } from '@/services/siswaService';
import { Siswa } from './types';

const SISWA_QUERY_KEY = 'siswa';

export function useSiswaQueries() {
  const {
    data: siswa,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [SISWA_QUERY_KEY],
    queryFn: async (): Promise<Siswa[]> => {
      console.log('Fetching siswa data...');
      return await siswaService.fetchAll();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    siswa,
    isLoading,
    error,
    refetch,
  };
}

export function useSiswaAvailableForMagang() {
  const {
    data: availableSiswa,
    isLoading: isLoadingAvailable,
    error: errorAvailable,
    refetch: refetchAvailable,
  } = useQuery({
    queryKey: [SISWA_QUERY_KEY, 'available-for-magang'],
    queryFn: async (): Promise<Siswa[]> => {
      console.log('Fetching available siswa for magang...');
      return await siswaService.fetchAvailableForMagang();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter for real-time accuracy
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    availableSiswa,
    isLoadingAvailable,
    errorAvailable,
    refetchAvailable,
  };
}

export function useSiswaById(id: string) {
  return useQuery({
    queryKey: [SISWA_QUERY_KEY, id],
    queryFn: async (): Promise<Siswa | null> => {
      if (!id) return null;
      return await siswaService.fetchById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
