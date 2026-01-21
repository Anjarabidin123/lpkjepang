
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  invoiceTable, 
  invoiceItemsTable, 
  kumiaiTable, 
  siswaMagangTable, 
  siswaTable 
} from '@/lib/localStorage/tables';

export function useInvoice() {
  const [invoiceList, setInvoiceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const invoices = invoiceTable.getAll();
      const items = invoiceItemsTable.getAll();
      const kumiais = kumiaiTable.getAll();
      const siswaMagangs = siswaMagangTable.getAll();
      const siswas = siswaTable.getAll();

      const enrichedInvoices = invoices.map(inv => {
        const kumiai = kumiais.find(k => k.id === inv.kumiai_id);
        const invItems = items
          .filter(item => item.invoice_id === inv.id)
          .map(item => {
            const sm = siswaMagangs.find(s => s.id === item.siswa_magang_id);
            const s = sm ? siswas.find(siswa => siswa.id === sm.siswa_id) : null;
            return {
              ...item,
              siswa_magang: sm ? {
                ...sm,
                siswa: s
              } : null
            };
          });

        return {
          ...inv,
          kumiai: kumiai ? { id: kumiai.id, nama: kumiai.nama } : null,
          invoice_items: invItems
        };
      }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setInvoiceList(enrichedInvoices);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data invoice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateInvoiceTotal = (items: any[]) => {
    return items.reduce((total, item) => total + (Number(item.nominal_fee) || 0), 0);
  };

  const createInvoice = async (invoiceData: any, invoiceItems: any[]) => {
    try {
      const total = calculateInvoiceTotal(invoiceItems);
      const invoice = invoiceTable.create({
        ...invoiceData,
        nominal: total
      });

      if (invoiceItems && invoiceItems.length > 0) {
        invoiceItems.forEach(item => {
          invoiceItemsTable.create({
            invoice_id: invoice.id,
            siswa_magang_id: item.siswa_magang_id,
            nominal_fee: item.nominal_fee,
            keterangan: item.keterangan || null
          });
        });
      }

      toast({
        title: "Berhasil",
        description: "Invoice berhasil dibuat",
      });
      
      fetchInvoice();
      return invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Gagal membuat invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateInvoice = async (id: string, invoiceData: any, invoiceItems?: any[]) => {
    try {
      let total = invoiceData.nominal;
      
      if (invoiceItems) {
        // Delete existing items
        const existingItems = invoiceItemsTable.getAll().filter(item => item.invoice_id === id);
        existingItems.forEach(item => invoiceItemsTable.delete(item.id));

        // Insert new items
        invoiceItems.forEach(item => {
          invoiceItemsTable.create({
            invoice_id: id,
            siswa_magang_id: item.siswa_magang_id,
            nominal_fee: item.nominal_fee,
            keterangan: item.keterangan || null
          });
        });
        
        total = calculateInvoiceTotal(invoiceItems);
      }

      invoiceTable.update(id, {
        ...invoiceData,
        nominal: total,
        updated_at: new Date().toISOString()
      });
      
      toast({
        title: "Berhasil",
        description: "Invoice berhasil diperbarui",
      });
      
      fetchInvoice();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      // Delete items first
      const items = invoiceItemsTable.getAll().filter(item => item.invoice_id === id);
      items.forEach(item => invoiceItemsTable.delete(item.id));
      
      invoiceTable.delete(id);
      
      toast({
        title: "Berhasil",
        description: "Invoice berhasil dihapus",
      });
      
      fetchInvoice();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus invoice",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getInvoiceById = async (id: string) => {
    try {
      const inv = invoiceTable.getById(id);
      if (!inv) return null;

      const items = invoiceItemsTable.getAll().filter(item => item.invoice_id === id);
      const kumiais = kumiaiTable.getAll();
      const siswaMagangs = siswaMagangTable.getAll();
      const siswas = siswaTable.getAll();

      const kumiai = kumiais.find(k => k.id === inv.kumiai_id);
      const invItems = items.map(item => {
        const sm = siswaMagangs.find(s => s.id === item.siswa_magang_id);
        const s = sm ? siswas.find(siswa => siswa.id === sm.siswa_id) : null;
        return {
          ...item,
          siswa_magang: sm ? {
            ...sm,
            siswa: s
          } : null
        };
      });

      return {
        ...inv,
        kumiai: kumiai ? { id: kumiai.id, nama: kumiai.nama } : null,
        invoice_items: invItems
      };
    } catch (error) {
      console.error('Error getting invoice by id:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  return {
    invoiceList,
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    fetchInvoice,
  };
}
