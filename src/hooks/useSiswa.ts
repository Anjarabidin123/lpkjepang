
import { useSiswaQueries, useSiswaAvailableForMagang } from './siswa/useSiswaQueries';
import { useSiswaMutations } from './siswa/useSiswaMutations';
import { useSiswaRealtime } from './siswa/useSiswaRealtime';

export * from './siswa/types';

export function useSiswa() {
  const queries = useSiswaQueries();
  const mutations = useSiswaMutations();
  
  // Set up realtime subscription
  useSiswaRealtime();

  return {
    ...queries,
    ...mutations,
  };
}

export function useSiswaForMagang() {
  const availableQueries = useSiswaAvailableForMagang();
  const mutations = useSiswaMutations();
  
  // Set up realtime subscription
  useSiswaRealtime();

  return {
    siswa: availableQueries.availableSiswa,
    isLoading: availableQueries.isLoadingAvailable,
    error: availableQueries.errorAvailable,
    refetch: availableQueries.refetchAvailable,
    ...mutations,
  };
}
