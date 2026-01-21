
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { kewajibanPembayaranTable, siswaTable, itemPembayaranTable } from '@/lib/localStorage/tables';

export function useKewajibanPembayaran() {
  const [kewajibanList, setKewajibanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchKewajiban = async () => {
    setLoading(true);
    try {
      const data = kewajibanPembayaranTable.getAll();
      const allSiswa = siswaTable.getAll();
      const allItems = itemPembayaranTable.getAll();
      
      const processedData = data.map(item => {
        const siswa = allSiswa.find(s => s.id === item.siswa_id);
        const itemPembayaran = allItems.find(i => i.id === item.item_pembayaran_id);
        
        return {
          ...item,
          nominal_wajib: Number(item.nominal_wajib) || 0,
          nominal_terbayar: Number(item.nominal_terbayar) || 0,
          sisa_kewajiban: Number(item.sisa_kewajiban) || 0,
          siswa: siswa ? { id: siswa.id, nama: (siswa as any).nama } : undefined,
          item_pembayaran: itemPembayaran ? {
            id: itemPembayaran.id,
            nama_item: (itemPembayaran as any).nama_item,
            nominal_wajib: Number((itemPembayaran as any).nominal_wajib) || 0
          } : undefined
        };
      }).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      
      setKewajibanList(processedData);
    } catch (error) {
      console.error('Error fetching kewajiban pembayaran:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kewajiban pembayaran",
        variant: "destructive",
      });
      setKewajibanList([]);
    } finally {
      setLoading(false);
    }
  };

  const getKewajibanBySiswa = async (siswaId: string) => {
    try {
      const data = kewajibanPembayaranTable.getAll().filter(item => item.siswa_id === siswaId);
      const allItems = itemPembayaranTable.getAll();
      
      const processedData = data.map(item => {
        const itemPembayaran = allItems.find(i => i.id === item.item_pembayaran_id);
        
        return {
          ...item,
          nominal_wajib: Number(item.nominal_wajib) || 0,
          nominal_terbayar: Number(item.nominal_terbayar) || 0,
          sisa_kewajiban: Number(item.sisa_kewajiban) || 0,
          item_pembayaran: itemPembayaran ? {
            id: itemPembayaran.id,
            nama_item: (itemPembayaran as any).nama_item,
            nominal_wajib: Number((itemPembayaran as any).nominal_wajib) || 0
          } : undefined
        };
      }).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      
      return processedData;
    } catch (error) {
      console.error('Error fetching kewajiban by siswa:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchKewajiban();
  }, []);

  return {
    kewajibanList,
    loading,
    fetchKewajiban,
    getKewajibanBySiswa,
  };
}
