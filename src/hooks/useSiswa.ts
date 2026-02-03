
import { useSiswaQueries, useSiswaAvailableForMagang } from './siswa/useSiswaQueries';
import { useSiswaMutations } from './siswa/useSiswaMutations';

export * from './siswa/types';

export function useSiswa() {
  const queries = useSiswaQueries();
  const mutations = useSiswaMutations();

  return {
    ...queries,
    ...mutations,
  };
}

export function useSiswaForMagang() {
  const availableQueries = useSiswaAvailableForMagang();
  const mutations = useSiswaMutations();

  // Set up realtime subscription (Disabled for Laravel Migration)
  // useSiswaRealtime();

  return {
    siswa: availableQueries.availableSiswa,
    isLoading: availableQueries.isLoadingAvailable,
    error: availableQueries.errorAvailable,
    refetch: availableQueries.refetchAvailable,
    ...mutations,
  };
}
