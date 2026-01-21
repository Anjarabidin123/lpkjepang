
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { siswaMagangService } from '@/services/siswaMagangService';
import { useToast } from '@/hooks/use-toast';

export function useSiswaMagangQuery() {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['siswa-magang'],
    queryFn: async () => {
      try {
        console.log('Starting siswa magang query...');
        const result = await siswaMagangService.fetchAll();
        console.log('Siswa magang query successful:', result?.length || 0, 'records');
        return result;
      } catch (error) {
        console.error('Siswa magang query failed:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch siswa magang data",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 0, // Always consider data stale for real-time sync
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
    refetchIntervalInBackground: true,
    retry: (failureCount, error) => {
      console.log('Siswa magang query retry attempt:', failureCount, error);
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useSiswaMagangByIdQuery(id: string) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['siswa-magang', id],
    queryFn: async () => {
      try {
        console.log('Starting siswa magang by ID query for:', id);
        const result = await siswaMagangService.fetchById(id);
        console.log('Siswa magang by ID query successful:', result);
        return result;
      } catch (error) {
        console.error('Siswa magang by ID query failed:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch siswa magang details",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      console.log('Siswa magang by ID query retry attempt:', failureCount, error);
      return failureCount < 2;
    },
  });
}

// Enhanced hook with real-time subscription
export function useSiswaMagangWithRealtime() {
  const queryResult = useSiswaMagangQuery();
  const { toast } = useToast();

  useEffect(() => {
    // Setup real-time subscription
    const cleanup = siswaMagangService.setupRealtimeSubscription((payload) => {
      // Invalidate queries when data changes
      queryResult.refetch();
      
      // Show notification for data changes
      if (payload.eventType === 'INSERT') {
        toast({
          title: "Data Baru",
          description: "Siswa magang baru telah ditambahkan",
          variant: "default",
        });
      } else if (payload.eventType === 'UPDATE') {
        toast({
          title: "Data Diperbarui",
          description: "Data siswa magang telah diperbarui",
          variant: "default",
        });
      } else if (payload.eventType === 'DELETE') {
        toast({
          title: "Data Dihapus",
          description: "Data siswa magang telah dihapus",
          variant: "default",
        });
      }
    });

    return cleanup;
  }, [queryResult.refetch, toast]);

  return queryResult;
}
