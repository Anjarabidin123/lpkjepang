
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useSiswaRealtime() {
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  // Set up realtime subscription for siswa data
  useEffect(() => {
    if (!user || !session) return;

    console.log('Setting up realtime subscription for siswa...');
    
    const channel = supabase
      .channel('siswa_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'siswa'
        },
        (payload) => {
          console.log('Realtime siswa update received:', payload);
          // Invalidate and refetch queries when data changes
          queryClient.invalidateQueries({ queryKey: ['siswa'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up siswa realtime subscription...');
      supabase.removeChannel(channel);
    };
  }, [user, session, queryClient]);
}
