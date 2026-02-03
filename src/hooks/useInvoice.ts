import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export function useInvoice() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoiceList = [], isLoading: loading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await authFetch(endpoints.invoices);
      if (!response.ok) throw new Error('Failed to fetch invoice data');
      const data = await response.json();
      return data.map((inv: any) => ({
        ...inv,
        id: inv.id.toString(),
        kumiai_id: inv.kumiai_id.toString(),
        kumiai: inv.kumiai ? { ...inv.kumiai, id: inv.kumiai.id.toString() } : null,
        invoice_items: (inv.invoice_items || []).map((item: any) => ({
          ...item,
          id: item.id.toString(),
          invoice_id: item.invoice_id.toString(),
          siswa_magang_id: item.siswa_magang_id.toString(),
          siswa_magang: item.siswa_magang ? {
            ...item.siswa_magang,
            id: item.siswa_magang.id.toString(),
            siswa: item.siswa_magang.siswa ? {
              ...item.siswa_magang.siswa,
              id: item.siswa_magang.siswa.id.toString()
            } : null
          } : null
        }))
      }));
    }
  });

  const createMutation = useMutation({
    mutationFn: async ({ data, items }: { data: any, items: any[] }) => {
      const response = await authFetch(endpoints.invoices, {
        method: 'POST',
        body: JSON.stringify({ ...data, invoice_items: items })
      });
      if (!response.ok) throw new Error('Failed to create invoice');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: "Berhasil", description: "Invoice berhasil dibuat" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, items }: { id: string, data: any, items?: any[] }) => {
      const response = await authFetch(`${endpoints.invoices}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...data, invoice_items: items })
      });
      if (!response.ok) throw new Error('Failed to update invoice');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: "Berhasil", description: "Invoice berhasil diperbarui" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.invoices}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete invoice');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: "Berhasil", description: "Invoice berhasil dihapus" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const getInvoiceById = (id: string) => {
    return invoiceList.find((inv: any) => inv.id === id) || null;
  };

  return {
    invoiceList,
    loading,
    createInvoice: (data: any, items: any[]) => createMutation.mutateAsync({ data, items }),
    updateInvoice: (id: string, data: any, items?: any[]) => updateMutation.mutateAsync({ id, data, items }),
    deleteInvoice: deleteMutation.mutateAsync,
    getInvoiceById,
    fetchInvoice: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  };
}
