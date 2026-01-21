import { useQuery } from '@tanstack/react-query';
import { jobOrderService } from '@/services/jobOrderService';
import { useJobOrderMutations } from '@/hooks/useJobOrderMutations';

// Re-export types for backward compatibility
export type { JobOrder, JobOrderInsert, JobOrderUpdate } from '@/types/jobOrder';

export function useJobOrder() {
  const { data: jobOrders, isLoading, error, refetch } = useQuery({
    queryKey: ['job_orders'],
    queryFn: async () => {
      try {
        console.log('useJobOrder - Starting to fetch job orders...');
        const result = await jobOrderService.fetchJobOrders();
        console.log('useJobOrder - Successfully fetched job orders:', result?.length || 0);
        return result;
      } catch (err) {
        console.error('useJobOrder - Error fetching job orders:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a table not exists error
      if (error?.message?.includes('does not exist') || error?.message?.includes('belum dibuat')) {
        return false;
      }
      // Otherwise retry up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  console.log('useJobOrder - Current state:', {
    jobOrdersCount: jobOrders?.length || 0,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message
  });

  const mutations = useJobOrderMutations();

  return {
    jobOrders,
    isLoading,
    error,
    refetch,
    ...mutations,
  };
}
