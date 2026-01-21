
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { itemPembayaranTable } from '@/lib/localStorage/tables';

export function useItemPembayaran() {
  const [itemPembayaranList, setItemPembayaranList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchItemPembayaran = async () => {
    setLoading(true);
    try {
      const data = itemPembayaranTable.getAll();
      
      const processedData = data.map(item => ({
        ...item,
        nominal_wajib: Number(item.nominal_wajib) || 0
      })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setItemPembayaranList(processedData);
    } catch (error) {
      console.error('Error fetching item pembayaran:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data item pembayaran",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createItemPembayaran = async (data: any) => {
    try {
      const processedData = {
        ...data,
        nominal_wajib: Number(data.nominal_wajib) || 0
      };
      
      itemPembayaranTable.create(processedData);

      toast({
        title: "Berhasil",
        description: "Item pembayaran berhasil ditambahkan",
      });
      
      await fetchItemPembayaran();
    } catch (error) {
      console.error('Error creating item pembayaran:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan item pembayaran",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItemPembayaran = async (id: string, data: any) => {
    try {
      const processedData = {
        ...data,
        nominal_wajib: Number(data.nominal_wajib) || 0
      };
      
      itemPembayaranTable.update(id, processedData);

      toast({
        title: "Berhasil",
        description: "Item pembayaran berhasil diperbarui",
      });
      
      await fetchItemPembayaran();
    } catch (error) {
      console.error('Error updating item pembayaran:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui item pembayaran",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteItemPembayaran = async (id: string) => {
    try {
      const success = itemPembayaranTable.delete(id);
      
      if (!success) throw new Error('Failed to delete item pembayaran');

      toast({
        title: "Berhasil",
        description: "Item pembayaran berhasil dihapus",
      });
      
      await fetchItemPembayaran();
    } catch (error) {
      console.error('Error deleting item pembayaran:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus item pembayaran",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchItemPembayaran();
  }, []);

  return {
    itemPembayaranList,
    loading,
    createItemPembayaran,
    updateItemPembayaran,
    deleteItemPembayaran,
    fetchItemPembayaran,
  };
}
