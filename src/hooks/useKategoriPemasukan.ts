
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { kategoriPemasukanTable } from '@/lib/localStorage/tables';

export interface KategoriPemasukan {
  id: string;
  nama_kategori: string;
  deskripsi?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useKategoriPemasukan() {
  const [categories, setCategories] = useState<KategoriPemasukan[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = kategoriPemasukanTable.getAll();
      // Sort by name
      const sortedData = [...data].sort((a, b) => a.nama_kategori.localeCompare(b.nama_kategori));
      setCategories(sortedData);
    } catch (error) {
      console.error('Error fetching income categories:', error);
      toast({
        title: "Error",
        description: "Failed to load income categories",
        variant: "destructive",
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data: Omit<KategoriPemasukan, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const insertedData = kategoriPemasukanTable.create(data);
      
      toast({
        title: "Success",
        description: "Income category created successfully",
      });
      
      await fetchCategories();
      return insertedData;
    } catch (error) {
      console.error('Error creating income category:', error);
      toast({
        title: "Error",
        description: "Failed to create income category",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, data: Partial<KategoriPemasukan>) => {
    try {
      const updatedData = kategoriPemasukanTable.update(id, data);
      
      if (!updatedData) throw new Error('Failed to update income category');

      toast({
        title: "Success",
        description: "Income category updated successfully",
      });
      
      await fetchCategories();
      return updatedData;
    } catch (error) {
      console.error('Error updating income category:', error);
      toast({
        title: "Error",
        description: "Failed to update income category",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const success = kategoriPemasukanTable.delete(id);
      
      if (!success) throw new Error('Failed to delete income category');

      toast({
        title: "Success",
        description: "Income category deleted successfully",
      });
      
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting income category:', error);
      toast({
        title: "Error",
        description: "Failed to delete income category",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    isAuthenticated: !!user,
  };
}
