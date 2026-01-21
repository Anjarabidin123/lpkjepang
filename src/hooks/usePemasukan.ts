
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { pemasukanTable, kategoriPemasukanTable } from '@/lib/localStorage/tables';

export interface Pemasukan {
  id: string;
  kategori_id?: string;
  nama_pemasukan: string;
  nominal: number;
  tanggal_pemasukan: string;
  keterangan?: string;
  created_at: string;
  updated_at: string;
  kategori_pemasukan?: {
    id: string;
    nama_kategori: string;
  };
}

export function usePemasukan() {
  const [incomes, setIncomes] = useState<Pemasukan[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const data = pemasukanTable.getAll();
      const categories = kategoriPemasukanTable.getAll();
      
      const processedData = data.map(item => {
        const category = categories.find(c => c.id === item.kategori_id);
        return {
          ...item,
          nominal: Number(item.nominal) || 0,
          kategori_pemasukan: category ? {
            id: category.id,
            nama_kategori: category.nama_kategori
          } : undefined
        };
      }).sort((a, b) => new Date(b.tanggal_pemasukan).getTime() - new Date(a.tanggal_pemasukan).getTime());
      
      setIncomes(processedData);
    } catch (error) {
      console.error('Error fetching income data:', error);
      toast({
        title: "Error",
        description: "Failed to load income data",
        variant: "destructive",
      });
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  const createIncome = async (data: Omit<Pemasukan, 'id' | 'created_at' | 'updated_at' | 'kategori_pemasukan'>) => {
    try {
      const insertedData = pemasukanTable.create({
        kategori_id: data.kategori_id || null,
        nama_pemasukan: data.nama_pemasukan,
        nominal: Number(data.nominal),
        tanggal_pemasukan: data.tanggal_pemasukan,
        keterangan: data.keterangan || null
      } as any);
      
      toast({
        title: "Success",
        description: "Income record created successfully",
      });
      
      await fetchIncomes();
      return insertedData;
    } catch (error) {
      console.error('Error creating income:', error);
      toast({
        title: "Error",
        description: "Failed to create income record",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateIncome = async (id: string, data: Partial<Pemasukan>) => {
    try {
      const updateData: any = {};
      if (data.kategori_id !== undefined) updateData.kategori_id = data.kategori_id;
      if (data.nama_pemasukan) updateData.nama_pemasukan = data.nama_pemasukan;
      if (data.nominal !== undefined) updateData.nominal = Number(data.nominal);
      if (data.tanggal_pemasukan) updateData.tanggal_pemasukan = data.tanggal_pemasukan;
      if (data.keterangan !== undefined) updateData.keterangan = data.keterangan;

      const updatedData = pemasukanTable.update(id, updateData);
      
      if (!updatedData) throw new Error('Failed to update income record');

      toast({
        title: "Success",
        description: "Income record updated successfully",
      });
      
      await fetchIncomes();
      return updatedData;
    } catch (error) {
      console.error('Error updating income:', error);
      toast({
        title: "Error",
        description: "Failed to update income record",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      const success = pemasukanTable.delete(id);
      
      if (!success) throw new Error('Failed to delete income record');

      toast({
        title: "Success",
        description: "Income record deleted successfully",
      });
      
      await fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
      toast({
        title: "Error",
        description: "Failed to delete income record",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  return {
    incomes,
    loading,
    createIncome,
    updateIncome,
    deleteIncome,
    fetchIncomes,
    isAuthenticated: !!user,
  };
}
