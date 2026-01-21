
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { invoiceItemsTable, siswaMagangTable, siswaTable } from '@/lib/localStorage/tables';

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  siswa_magang_id: string;
  nominal_fee: number;
  keterangan?: string;
  created_at: string;
  updated_at: string;
  siswa_magang?: {
    id: string;
    siswa?: {
      id: string;
      nama: string;
    };
  };
}

export function useInvoiceItems() {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInvoiceItems = async (invoiceId?: string) => {
    setLoading(true);
    try {
      let items = invoiceItemsTable.getAll();

      if (invoiceId) {
        items = items.filter(item => item.invoice_id === invoiceId);
      }

      const siswaMagangs = siswaMagangTable.getAll();
      const siswas = siswaTable.getAll();

      const enrichedItems = items.map(item => {
        const sm = siswaMagangs.find(s => s.id === item.siswa_magang_id);
        const s = sm ? siswas.find(siswa => siswa.id === sm.siswa_id) : null;
        return {
          ...item,
          siswa_magang: sm ? {
            ...sm,
            siswa: s
          } : null
        };
      }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setInvoiceItems(enrichedItems as InvoiceItem[]);
    } catch (error) {
      console.error('Error fetching invoice items:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data invoice items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvoiceItems = async (invoiceId: string, items: { siswa_magang_id: string; nominal_fee: number; keterangan?: string }[]) => {
    try {
      items.forEach(item => {
        invoiceItemsTable.create({
          invoice_id: invoiceId,
          siswa_magang_id: item.siswa_magang_id,
          nominal_fee: item.nominal_fee,
          keterangan: item.keterangan || null
        });
      });
      
      toast({
        title: "Berhasil",
        description: "Invoice items berhasil ditambahkan",
      });
      
      await fetchInvoiceItems(invoiceId);
    } catch (error) {
      console.error('Error creating invoice items:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan invoice items",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateInvoiceItem = async (id: string, data: Partial<InvoiceItem>) => {
    try {
      invoiceItemsTable.update(id, data);
      
      toast({
        title: "Berhasil",
        description: "Invoice item berhasil diperbarui",
      });
      
      await fetchInvoiceItems();
    } catch (error) {
      console.error('Error updating invoice item:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui invoice item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteInvoiceItem = async (id: string) => {
    try {
      invoiceItemsTable.delete(id);
      
      toast({
        title: "Berhasil",
        description: "Invoice item berhasil dihapus",
      });
      
      await fetchInvoiceItems();
    } catch (error) {
      console.error('Error deleting invoice item:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus invoice item",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteInvoiceItemsByInvoice = async (invoiceId: string) => {
    try {
      const items = invoiceItemsTable.getAll().filter(item => item.invoice_id === invoiceId);
      items.forEach(item => invoiceItemsTable.delete(item.id));
    } catch (error) {
      console.error('Error deleting invoice items by invoice:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchInvoiceItems();
  }, []);

  return {
    invoiceItems,
    loading,
    createInvoiceItems,
    updateInvoiceItem,
    deleteInvoiceItem,
    deleteInvoiceItemsByInvoice,
    fetchInvoiceItems,
  };
}
