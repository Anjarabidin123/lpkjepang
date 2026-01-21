
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { arusKasTable } from '@/lib/localStorage/tables';

export function useArusKas() {
  const [arusKasList, setArusKasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchArusKas = async () => {
    setLoading(true);
    try {
      const data = arusKasTable.getAll();
      
      // Process data to ensure proper number formatting
      const processedData = data.map(item => ({
        ...item,
        nominal: Number(item.nominal) || 0
      })).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      
      setArusKasList(processedData);
    } catch (error) {
      console.error('Error fetching arus kas:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data arus kas",
        variant: "destructive",
      });
      setArusKasList([]);
    } finally {
      setLoading(false);
    }
  };

  const createArusKas = async (data: any) => {
    try {
      // Validate required fields
      if (!data.jenis || !data.kategori || !data.nominal || !data.tanggal) {
        throw new Error('Semua field wajib harus diisi');
      }
      
      // Ensure nominal is a number
      const nominalValue = typeof data.nominal === 'string' ? parseFloat(data.nominal) : data.nominal;
      if (isNaN(nominalValue) || nominalValue <= 0) {
        throw new Error('Nominal harus berupa angka yang valid dan lebih dari 0');
      }
      
      const processedData = {
        jenis: data.jenis,
        kategori: data.kategori,
        nominal: nominalValue,
        tanggal: data.tanggal,
        keterangan: data.keterangan || null
      };

      const insertedData = arusKasTable.create(processedData);

      toast({
        title: "Berhasil",
        description: "Transaksi berhasil ditambahkan",
      });
      
      await fetchArusKas();
      return insertedData;
    } catch (error: any) {
      console.error('Error creating arus kas:', error);
      toast({
        title: "Error",
        description: `Gagal menambahkan transaksi: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateArusKas = async (id: string, data: any) => {
    try {
      // Validate required fields
      if (!data.jenis || !data.kategori || !data.nominal || !data.tanggal) {
        throw new Error('Semua field wajib harus diisi');
      }
      
      // Ensure nominal is a number
      const nominalValue = typeof data.nominal === 'string' ? parseFloat(data.nominal) : data.nominal;
      if (isNaN(nominalValue) || nominalValue <= 0) {
        throw new Error('Nominal harus berupa angka yang valid dan lebih dari 0');
      }
      
      const processedData = {
        jenis: data.jenis,
        kategori: data.kategori,
        nominal: nominalValue,
        tanggal: data.tanggal,
        keterangan: data.keterangan || null
      };

      const updatedData = arusKasTable.update(id, processedData);

      toast({
        title: "Berhasil",
        description: "Transaksi berhasil diperbarui",
      });
      
      await fetchArusKas();
      return updatedData;
    } catch (error: any) {
      console.error('Error updating arus kas:', error);
      toast({
        title: "Error",
        description: `Gagal memperbarui transaksi: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteArusKas = async (id: string) => {
    try {
      const success = arusKasTable.delete(id);
      
      if (!success) throw new Error('Failed to delete transaction');

      toast({
        title: "Berhasil",
        description: "Transaksi berhasil dihapus",
      });
      
      await fetchArusKas();
    } catch (error: any) {
      console.error('Error deleting arus kas:', error);
      toast({
        title: "Error",
        description: `Gagal menghapus transaksi: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getArusKasById = (id: string) => {
    try {
      const data = arusKasTable.getById(id);
      if (!data) return null;
      
      return {
        ...data,
        nominal: Number(data.nominal) || 0
      };
    } catch (error) {
      console.error('Error getting arus kas by id:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchArusKas();
  }, []);

  return {
    arusKasList,
    loading,
    createArusKas,
    updateArusKas,
    deleteArusKas,
    getArusKasById,
    fetchArusKas,
  };
}
