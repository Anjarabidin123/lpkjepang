
import { useSiswaMagangWithRealtime, useSiswaMagangByIdQuery } from './useSiswaMagangQueries';
import { useSiswaMagangMutations } from './useSiswaMagangMutations';

export function useSiswaMagang() {
  const { data: siswaMagang = [], isLoading, error, refetch } = useSiswaMagangWithRealtime();
  const mutations = useSiswaMagangMutations();

  return {
    siswaMagang,
    isLoading,
    error,
    refetch,
    ...mutations,
  };
}

export function useSiswaMagangById(id: string) {
  const { data: siswaMagang, isLoading, error, refetch } = useSiswaMagangByIdQuery(id);
  const mutations = useSiswaMagangMutations();

  return {
    siswaMagang,
    isLoading,
    error,
    refetch,
    ...mutations,
  };
}

// Re-export types for backward compatibility
export type { SiswaMagang, CreateSiswaMagangData, UpdateSiswaMagangData } from '@/types/siswaMagang';
