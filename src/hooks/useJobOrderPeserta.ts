
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JobOrderPeserta } from '@/types/jobOrder';
import { useToast } from '@/hooks/use-toast';
import { jobOrderPesertaService } from '@/services/jobOrder/jobOrderPesertaService';

export function useJobOrderPeserta(jobOrderId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['job_order_peserta', jobOrderId],
    queryFn: async (): Promise<JobOrderPeserta[]> => {
      if (!jobOrderId) return [];
      return await jobOrderPesertaService.fetchByJobOrderId(jobOrderId);
    },
    enabled: !!jobOrderId,
  });

  const addPesertaMutation = useMutation({
    mutationFn: async ({ siswa_ids, job_order_id }: { siswa_ids: string[], job_order_id: string }) => {
      return await jobOrderPesertaService.addPeserta(siswa_ids, job_order_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_order_peserta', jobOrderId] });
      // Also invalidate job orders list to update counts
      queryClient.invalidateQueries({ queryKey: ['job_orders'] });
      toast({
        title: "Berhasil",
        description: "Peserta berhasil ditambahkan",
      });
    },
    onError: (error) => {
      console.error('Error adding participants:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan peserta",
        variant: "destructive",
      });
    }
  });

  const updatePesertaMutation = useMutation({
    mutationFn: async ({ id, status, keterangan }: { id: string, status: string, keterangan: string }) => {
      return await jobOrderPesertaService.updatePeserta(id, { status, keterangan });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_order_peserta', jobOrderId] });
      toast({
        title: "Berhasil",
        description: "Status peserta berhasil diperbarui",
      });
    },
    onError: (error) => {
      console.error('Error updating participant:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status peserta",
        variant: "destructive",
      });
    }
  });

  const deletePesertaMutation = useMutation({
    mutationFn: async (id: string) => {
      return await jobOrderPesertaService.deletePeserta(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job_order_peserta', jobOrderId] });
      queryClient.invalidateQueries({ queryKey: ['job_orders'] });
      toast({
        title: "Berhasil",
        description: "Peserta berhasil dihapus",
      });
    },
    onError: (error) => {
      console.error('Error deleting participant:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus peserta",
        variant: "destructive",
      });
    }
  });

  return {
    // Query data
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    
    // For backward compatibility with existing component
    peserta: query.data || [],
    
    // Mutation methods
    addPeserta: addPesertaMutation.mutate,
    updatePeserta: updatePesertaMutation.mutate,
    deletePeserta: deletePesertaMutation.mutate,
    isAddingPeserta: addPesertaMutation.isPending,
    isUpdatingPeserta: updatePesertaMutation.isPending,
    isDeletingPeserta: deletePesertaMutation.isPending,
  };
}
