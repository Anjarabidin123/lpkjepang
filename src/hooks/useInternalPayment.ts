
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { internalPaymentTable, siswaTable, itemPembayaranTable } from '@/lib/localStorage/tables';

export interface InternalPayment {
  id: string;
  siswa_id: string;
  item_pembayaran_id: string;
  nominal: number;
  tanggal_pembayaran: string;
  metode_pembayaran: string;
  status: string;
  keterangan?: string;
  created_at: string;
  updated_at: string;
  siswa?: {
    id: string;
    nama: string;
  };
  item_pembayaran?: {
    id: string;
    nama_item: string;
    nominal_wajib: number;
  };
}

export function useInternalPayment() {
  const [payments, setPayments] = useState<InternalPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = internalPaymentTable.getAll();
      const allSiswa = siswaTable.getAll();
      const allItems = itemPembayaranTable.getAll();
      
      const processedData = data.map(item => {
        const siswa = allSiswa.find(s => s.id === item.siswa_id);
        const itemPembayaran = allItems.find(i => i.id === item.item_pembayaran_id);
        
        return {
          ...item,
          nominal: Number(item.nominal) || 0,
          siswa: siswa ? { id: siswa.id, nama: (siswa as any).nama } : undefined,
          item_pembayaran: itemPembayaran ? {
            id: itemPembayaran.id,
            nama_item: (itemPembayaran as any).nama_item,
            nominal_wajib: Number((itemPembayaran as any).nominal_wajib) || 0
          } : undefined
        };
      }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setPayments(processedData as InternalPayment[]);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payment data",
        variant: "destructive",
      });
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (data: Omit<InternalPayment, 'id' | 'created_at' | 'updated_at' | 'siswa' | 'item_pembayaran' | 'status'>) => {
    try {
      const insertedData = internalPaymentTable.create({
        siswa_id: data.siswa_id,
        item_pembayaran_id: data.item_pembayaran_id,
        nominal: Number(data.nominal),
        tanggal_pembayaran: data.tanggal_pembayaran,
        metode_pembayaran: data.metode_pembayaran || 'Tunai',
        status: 'Lunas', // Default status
        keterangan: data.keterangan || null
      } as any);

      toast({
        title: "Success",
        description: "Payment created successfully",
      });
      
      await fetchPayments();
      return insertedData;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error",
        description: "Failed to create payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePayment = async (id: string, data: Partial<InternalPayment>) => {
    try {
      const updateData: any = {};
      if (data.siswa_id) updateData.siswa_id = data.siswa_id;
      if (data.item_pembayaran_id) updateData.item_pembayaran_id = data.item_pembayaran_id;
      if (data.nominal !== undefined) updateData.nominal = Number(data.nominal);
      if (data.tanggal_pembayaran) updateData.tanggal_pembayaran = data.tanggal_pembayaran;
      if (data.metode_pembayaran) updateData.metode_pembayaran = data.metode_pembayaran;
      if (data.keterangan !== undefined) updateData.keterangan = data.keterangan;
      if (data.status) updateData.status = data.status;

      const updatedData = internalPaymentTable.update(id, updateData);
      
      if (!updatedData) throw new Error('Failed to update payment');

      toast({
        title: "Success",
        description: "Payment updated successfully",
      });
      
      await fetchPayments();
      return updatedData;
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      const success = internalPaymentTable.delete(id);
      
      if (!success) throw new Error('Failed to delete payment');

      toast({
        title: "Success",
        description: "Payment deleted successfully",
      });
      
      await fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getPaymentById = async (id: string) => {
    try {
      const payment = internalPaymentTable.getById(id);
      if (!payment) return null;
      
      const siswa = siswaTable.getById(payment.siswa_id);
      const itemPembayaran = itemPembayaranTable.getById(payment.item_pembayaran_id);
      
      return {
        ...payment,
        siswa: siswa ? { id: siswa.id, nama: (siswa as any).nama } : undefined,
        item_pembayaran: itemPembayaran ? {
          id: itemPembayaran.id,
          nama_item: (itemPembayaran as any).nama_item,
          nominal_wajib: Number((itemPembayaran as any).nominal_wajib) || 0
        } : undefined
      };
    } catch (error) {
      console.error('Error getting payment by id:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentById,
    fetchPayments,
    isAuthenticated: !!user,
  };
}
