import { useQuery } from '@tanstack/react-query';
import { authFetch } from '@/lib/api-client';

export function useDashboardData() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-full-data'],
    queryFn: async () => {
      console.log('Fetching dashboard data from Laravel API...');

      const endpointKeys = [
        'job-orders',
        'siswa',
        'programs',
        'kumiai',
        'lpk-mitra',
        'perusahaan',
        'siswa-magang'
      ];

      const responses = await Promise.all(
        endpointKeys.map(ep => authFetch(`/${ep}`).catch(err => {
          console.error(`Failed to fetch ${ep}:`, err);
          return null;
        }))
      );

      const results = await Promise.all(
        responses.map(async (res, index) => {
          if (res && res.ok) {
            return await res.json();
          }
          console.warn(`Response for ${endpointKeys[index]} was not ok`);
          return [];
        })
      );

      const [
        jobOrders,
        siswa,
        programs,
        kumiai,
        lpkMitra,
        perusahaan,
        siswaMagang
      ] = results;

      const mapIds = (items: any[]) => items?.map(item => ({
        ...item,
        id: item.id?.toString(),
        // Optional: map typical foreign keys to string as well for safety
        siswa_id: item.siswa_id?.toString(),
        kumiai_id: item.kumiai_id?.toString(),
        perusahaan_id: item.perusahaan_id?.toString(),
        program_id: item.program_id?.toString(),
      })) || [];

      return {
        jobOrders: mapIds(jobOrders),
        siswa: mapIds(siswa),
        programs: mapIds(programs),
        siswaMagang: mapIds(siswaMagang),
        kumiai: mapIds(kumiai),
        lpkMitra: mapIds(lpkMitra),
        perusahaan: mapIds(perusahaan)
      };
    },
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    jobOrders: data?.jobOrders || [],
    siswa: data?.siswa || [],
    programs: data?.programs || [],
    siswaMagang: data?.siswaMagang || [],
    kumiai: data?.kumiai || [],
    lpkMitra: data?.lpkMitra || [],
    perusahaan: data?.perusahaan || [],
    isLoading
  };
}
