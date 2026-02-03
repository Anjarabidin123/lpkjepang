import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading: loading } = useQuery({
    queryKey: ['internal-payments'],
    queryFn: async () => {
      const response = await authFetch(endpoints.internalPayments);
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        siswa_id: item.siswa_id.toString(),
        item_pembayaran_id: item.item_pembayaran_id.toString(),
        nominal: Number(item.nominal) || 0,
        siswa: item.siswa ? {
          id: item.siswa.id.toString(),
          nama: item.siswa.nama_lengkap || item.siswa.nama
        } : undefined,
        item_pembayaran: item.item_pembayaran ? {
          id: item.item_pembayaran.id.toString(),
          nama_item: item.item_pembayaran.nama_item,
          nominal_wajib: Number(item.item_pembayaran.nominal_wajib) || 0
        } : undefined
      })) as InternalPayment[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<InternalPayment, 'id' | 'created_at' | 'updated_at' | 'siswa' | 'item_pembayaran'>) => {
      const response = await authFetch(endpoints.internalPayments, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create payment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-payments'] });
      toast({ title: "Success", description: "Payment created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<InternalPayment>) => {
      const response = await authFetch(`${endpoints.internalPayments}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update payment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-payments'] });
      toast({ title: "Success", description: "Payment updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await authFetch(`${endpoints.internalPayments}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete payment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-payments'] });
      toast({ title: "Success", description: "Payment deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const getPaymentById = (id: string) => {
    return payments.find(p => p.id === id) || null;
  };

  return {
    payments,
    loading,
    createPayment: createMutation.mutateAsync,
    updatePayment: (id: string, data: any) => updateMutation.mutateAsync({ id, ...data }),
    deletePayment: deleteMutation.mutateAsync,
    getPaymentById,
    fetchPayments: () => queryClient.invalidateQueries({ queryKey: ['internal-payments'] }),
  };
}
