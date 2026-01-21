
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { kategoriPengeluaranTable } from '@/lib/localStorage/tables';

export interface KategoriPengeluaran {
  id: string;
  nama_kategori: string;
  deskripsi?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useKategoriPengeluaran() {
  const [categories, setCategories] = useState<KategoriPengeluaran[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = kategoriPengeluaranTable.getAll();
      // Sort by name
      const sortedData = [...data].sort((a, b) => a.nama_kategori.localeCompare(b.nama_kategori));
      setCategories(sortedData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load expense categories",
        variant: "destructive",
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data: Omit<KategoriPengeluaran, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const insertedData = kategoriPengeluaranTable.create(data);
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      
      await fetchCategories();
      return insertedData;
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCategory = async (id: string, data: Partial<KategoriPengeluaran>) => {
    try {
      const updatedData = kategoriPengeluaranTable.update(id, data);
      
      if (!updatedData) throw new Error('Failed to update category');

      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      
      await fetchCategories();
      return updatedData;
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const success = kategoriPengeluaranTable.delete(id);
      
      if (!success) throw new Error('Failed to delete category');

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
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
