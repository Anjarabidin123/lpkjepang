import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export function useKewajibanPembayaran() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kewajibanList = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['kewajiban-pembayaran'],
    queryFn: async () => {
      const response = await authFetch(endpoints.kewajibanPembayaran);
      if (!response.ok) throw new Error('Failed to fetch kewajiban pembayaran');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        siswa_id: item.siswa_id.toString(),
        item_pembayaran_id: item.item_pembayaran_id.toString(),
        nominal_wajib: Number(item.nominal_wajib) || 0,
        nominal_terbayar: Number(item.nominal_terbayar) || 0,
        sisa_kewajiban: Number(item.sisa_kewajiban) || 0,
        siswa: item.siswa ? {
          id: item.siswa.id.toString(),
          nama: item.siswa.nama_lengkap || item.siswa.nama
        } : undefined,
        item_pembayaran: item.item_pembayaran ? {
          id: item.item_pembayaran.id.toString(),
          nama_item: item.item_pembayaran.nama_item,
          nominal_wajib: Number(item.item_pembayaran.nominal_wajib) || 0
        } : undefined
      }));
    }
  });

  const getKewajibanBySiswa = (siswaId: string) => {
    return kewajibanList.filter((item: any) => item.siswa_id === siswaId);
  };

  return {
    kewajibanList,
    loading,
    fetchKewajiban: refetch,
    getKewajibanBySiswa,
  };
}
