
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { pengeluaranTable, kategoriPengeluaranTable } from '@/lib/localStorage/tables';

export interface Pengeluaran {
  id: string;
  kategori_id?: string;
  nama_pengeluaran: string;
  nominal: number;
  tanggal_pengeluaran: string;
  keterangan?: string;
  created_at: string;
  updated_at: string;
  kategori_pengeluaran?: {
    id: string;
    nama_kategori: string;
  };
}

export function usePengeluaran() {
  const [expenses, setExpenses] = useState<Pengeluaran[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = pengeluaranTable.getAll();
      const categories = kategoriPengeluaranTable.getAll();
      
      const processedData = data.map(item => {
        const category = categories.find(c => c.id === item.kategori_id);
        return {
          ...item,
          nominal: Number(item.nominal) || 0,
          kategori_pengeluaran: category ? {
            id: category.id,
            nama_kategori: category.nama_kategori
          } : undefined
        };
      }).sort((a, b) => new Date(b.tanggal_pengeluaran).getTime() - new Date(a.tanggal_pengeluaran).getTime());
      
      setExpenses(processedData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive",
      });
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (data: Omit<Pengeluaran, 'id' | 'created_at' | 'updated_at' | 'kategori_pengeluaran'>) => {
    try {
      const insertedData = pengeluaranTable.create({
        ...data,
        nominal: Number(data.nominal)
      } as any);
      
      toast({
        title: "Success",
        description: "Expense created successfully",
      });
      
      await fetchExpenses();
      return insertedData;
    } catch (error) {
      console.error('Error creating expense:', error);
      toast({
        title: "Error",
        description: "Failed to create expense",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateExpense = async (id: string, data: Partial<Pengeluaran>) => {
    try {
      const updateData: any = { ...data };
      if (data.nominal !== undefined) {
        updateData.nominal = Number(data.nominal);
      }

      const updatedData = pengeluaranTable.update(id, updateData);
      
      if (!updatedData) throw new Error('Failed to update expense');

      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      
      await fetchExpenses();
      return updatedData;
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const success = pengeluaranTable.delete(id);
      
      if (!success) throw new Error('Failed to delete expense');

      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      
      await fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchExpenses,
    isAuthenticated: !!user,
  };
}
