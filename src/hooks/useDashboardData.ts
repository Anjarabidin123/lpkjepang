
import { useQuery } from '@tanstack/react-query';
import { 
  jobOrderTable, 
  siswaTable, 
  programTable, 
  siswaMagangTable, 
  kumiaiTable, 
  lpkMitraTable, 
  perusahaanTable,
  jenisKerjaTable
} from '@/lib/localStorage/tables';

export function useDashboardData() {
  const { data: jobOrders, isLoading: jobOrdersLoading } = useQuery({
    queryKey: ['dashboard-job-orders'],
    queryFn: async () => {
      console.log('Fetching job orders for dashboard from localStorage...');
      const data = jobOrderTable.getAll();
      
      // Join with kumiai and jenis_kerja
      const joinedData = data.map(item => ({
        ...item,
        kumiai: kumiaiTable.getById(item.kumiai_id),
        jenis_kerja: jenisKerjaTable.getById(item.jenis_kerja_id)
      }));
      
      console.log('Job orders fetched successfully:', joinedData.length, 'records');
      return joinedData;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: siswa, isLoading: siswaLoading } = useQuery({
    queryKey: ['dashboard-siswa'],
    queryFn: async () => {
      console.log('Fetching siswa for dashboard from localStorage...');
      const data = siswaTable.getAll();
      console.log('Siswa fetched successfully:', data.length, 'records');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ['dashboard-programs'],
    queryFn: async () => {
      console.log('Fetching programs for dashboard from localStorage...');
      const data = programTable.getAll();
      console.log('Programs fetched successfully:', data.length, 'records');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: siswaMagang, isLoading: siswaMagangLoading } = useQuery({
    queryKey: ['dashboard-siswa-magang'],
    queryFn: async () => {
      console.log('Fetching siswa magang for dashboard from localStorage...');
      const data = siswaMagangTable.getAll();
      
      const joinedData = data.map(item => ({
        ...item,
        siswa: siswaTable.getById(item.siswa_id) || { id: item.siswa_id, nama: 'Unknown' },
        perusahaan: perusahaanTable.getById(item.perusahaan_id),
        kumiai: kumiaiTable.getById(item.kumiai_id),
        program: programTable.getById(item.program_id),
        jenis_kerja: jenisKerjaTable.getById(item.jenis_kerja_id)
      }));
      
      console.log('Siswa magang fetched successfully:', joinedData.length, 'records');
      return joinedData;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: kumiai, isLoading: kumiaiLoading } = useQuery({
    queryKey: ['dashboard-kumiai'],
    queryFn: async () => {
      console.log('Fetching kumiai for dashboard from localStorage...');
      const data = kumiaiTable.getAll();
      console.log('Kumiai fetched successfully:', data.length, 'records');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: lpkMitra, isLoading: lpkMitraLoading } = useQuery({
    queryKey: ['dashboard-lpk-mitra'],
    queryFn: async () => {
      console.log('Fetching LPK Mitra for dashboard from localStorage...');
      const data = lpkMitraTable.getAll();
      console.log('LPK Mitra fetched successfully:', data.length, 'records');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: perusahaan, isLoading: perusahaanLoading } = useQuery({
    queryKey: ['dashboard-perusahaan'],
    queryFn: async () => {
      console.log('Fetching perusahaan for dashboard from localStorage...');
      const data = perusahaanTable.getAll();
      console.log('Perusahaan fetched successfully:', data.length, 'records');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    jobOrders,
    siswa,
    programs,
    siswaMagang,
    kumiai,
    lpkMitra,
    perusahaan,
    isLoading: jobOrdersLoading || siswaLoading || programsLoading || siswaMagangLoading || kumiaiLoading || lpkMitraLoading || perusahaanLoading
  };
}
