
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { jobOrderService } from '@/services/jobOrderService';
import { JobOrderInsert, JobOrderUpdateData } from '@/types/jobOrder';

export function useJobOrderMutations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: JobOrderInsert) => {
      console.log('Creating job order with mutation:', data);
      return jobOrderService.createJobOrder(data);
    },
    onSuccess: (data) => {
      console.log('Job order created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['job_orders'] });
      toast({
        title: "Berhasil",
        description: `Job order "${data.nama_job_order}" berhasil ditambahkan`,
      });
    },
    onError: (error: any) => {
      console.error('Error creating job order:', error);
      const errorMessage = error.message || 'Terjadi kesalahan saat membuat job order';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JobOrderUpdateData }) => {
      console.log('Updating job order with mutation:', id, data);
      return jobOrderService.updateJobOrder(id, { ...data, id });
    },
    onSuccess: (data) => {
      console.log('Job order updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['job_orders'] });
      toast({
        title: "Berhasil",
        description: `Job order "${data.nama_job_order}" berhasil diperbarui`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating job order:', error);
      const errorMessage = error.message || 'Terjadi kesalahan saat memperbarui job order';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting job order with mutation:', id);
      return jobOrderService.deleteJobOrder(id);
    },
    onSuccess: () => {
      console.log('Job order deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['job_orders'] });
      toast({
        title: "Berhasil",
        description: "Job order berhasil dihapus",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting job order:', error);
      const errorMessage = error.message || 'Terjadi kesalahan saat menghapus job order';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    createJobOrder: createMutation.mutate,
    updateJobOrder: updateMutation.mutate,
    deleteJobOrder: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
