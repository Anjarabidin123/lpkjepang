
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useMonitoringData() {
  return useQuery({
    queryKey: ['monitoring-data'],
    queryFn: async () => {
      try {
        console.log('Fetching monitoring data...');

        // Fetch siswa data
        const { data: siswa, error: siswaError } = await supabase
          .from('siswa')
          .select('*');

        if (siswaError) {
          console.error('Error fetching siswa:', siswaError);
          throw siswaError;
        }

        // Fetch siswa_magang data
        const { data: siswaMagang, error: siswaMagangError } = await supabase
          .from('siswa_magang')
          .select('*');

        if (siswaMagangError) {
          console.error('Error fetching siswa_magang:', siswaMagangError);
          throw siswaMagangError;
        }

        // Fetch kumiai data
        const { data: kumiai, error: kumiaiError } = await supabase
          .from('kumiai')
          .select('*');

        if (kumiaiError) {
          console.error('Error fetching kumiai:', kumiaiError);
          throw kumiaiError;
        }

        // Fetch lpk_mitra data  
        const { data: lpkMitra, error: lpkMitraError } = await supabase
          .from('lpk_mitra')
          .select('*');

        if (lpkMitraError) {
          console.error('Error fetching lpk_mitra:', lpkMitraError);
          throw lpkMitraError;
        }

        // Fetch perusahaan data
        const { data: perusahaan, error: perusahaanError } = await supabase
          .from('perusahaan')
          .select('*');

        if (perusahaanError) {
          console.error('Error fetching perusahaan:', perusahaanError);
          throw perusahaanError;
        }

        // Calculate statistics with safe null checks
        const totalSiswa = siswa?.length || 0;
        const totalSiswaMagang = siswaMagang?.length || 0;
        const totalKumiai = kumiai?.length || 0;
        const totalLpkMitra = lpkMitra?.length || 0;
        const totalPerusahaan = perusahaan?.length || 0;

        // Status distribution for siswa with safe processing
        const siswaStatusDistribution = siswa?.reduce((acc: any, item: any) => {
          const status = item?.status || 'Unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {}) || {};

        // Active entities with safe filtering
        const activeKumiai = kumiai?.filter((item: any) => item?.is_active !== false).length || totalKumiai;
        const activeLpkMitra = totalLpkMitra; // No status field, assume all active
        const activePerusahaan = totalPerusahaan; // No status field, assume all active

        console.log('Monitoring data fetched successfully:', {
          totalSiswa,
          totalSiswaMagang,
          totalKumiai,
          totalLpkMitra,
          totalPerusahaan
        });

        return {
          totalSiswa,
          totalSiswaMagang,
          totalKumiai,
          totalLpkMitra,
          totalPerusahaan,
          siswaStatusDistribution,
          activeKumiai,
          activeLpkMitra,
          activePerusahaan,
          siswa: siswa || [],
          siswaMagang: siswaMagang || [],
          kumiai: kumiai || [],
          lpkMitra: lpkMitra || [],
          perusahaan: perusahaan || [],
        };
      } catch (error) {
        console.error('Error in monitoring data query:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      console.log('Monitoring data query retry attempt:', failureCount, error);
      return failureCount < 3;
    }
  });
}
