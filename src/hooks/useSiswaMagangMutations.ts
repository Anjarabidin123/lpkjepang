
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { siswaMagangService } from '@/services/siswaMagangService';
import { useToast } from '@/hooks/use-toast';
import type { CreateSiswaMagangData, UpdateSiswaMagangData } from '@/types/siswaMagang';

export function useSiswaMagangMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createSiswaMagang = useMutation({
    mutationFn: async (data: CreateSiswaMagangData) => {
      console.log('Creating siswa magang mutation with data:', data);
      return await siswaMagangService.create(data);
    },
    onSuccess: (data) => {
      console.log('Siswa magang created successfully:', data);
      
      // Invalidate and refetch related queries to maintain synchronization
      queryClient.invalidateQueries({ queryKey: ['siswa-magang'] });
      queryClient.invalidateQueries({ queryKey: ['siswa', 'available-for-magang'] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      
      toast({
        title: "Berhasil",
        description: "Siswa magang berhasil ditambahkan",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Create siswa magang mutation failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create siswa magang",
        variant: "destructive",
      });
    },
  });

  const updateSiswaMagang = useMutation({
    mutationFn: async (data: UpdateSiswaMagangData) => {
      console.log('Updating siswa magang mutation with data:', data);
      return await siswaMagangService.update(data);
    },
    onSuccess: (data) => {
      console.log('Siswa magang updated successfully:', data);
      
      // Invalidate and refetch related queries to maintain synchronization
      queryClient.invalidateQueries({ queryKey: ['siswa-magang'] });
      queryClient.invalidateQueries({ queryKey: ['siswa', 'available-for-magang'] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      
      toast({
        title: "Berhasil",
        description: "Siswa magang berhasil diperbarui",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Update siswa magang mutation failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update siswa magang",
        variant: "destructive",
      });
    },
  });

  const deleteSiswaMagang = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting siswa magang mutation with id:', id);
      return await siswaMagangService.delete(id);
    },
    onSuccess: () => {
      console.log('Siswa magang deleted successfully');
      
      // Invalidate and refetch related queries to maintain synchronization
      queryClient.invalidateQueries({ queryKey: ['siswa-magang'] });
      queryClient.invalidateQueries({ queryKey: ['siswa', 'available-for-magang'] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      
      toast({
        title: "Berhasil",
        description: "Siswa magang berhasil dihapus",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Delete siswa magang mutation failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete siswa magang",
        variant: "destructive",
      });
    },
  });

  const updateSiswaMagangStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log('Updating siswa magang status mutation:', id, status);
      return await siswaMagangService.updateStatus(id, status);
    },
    onSuccess: (data) => {
      console.log('Siswa magang status updated successfully:', data);
      
      // Invalidate and refetch related queries to maintain synchronization
      queryClient.invalidateQueries({ queryKey: ['siswa-magang'] });
      queryClient.invalidateQueries({ queryKey: ['siswa', 'available-for-magang'] });
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      
      toast({
        title: "Berhasil",
        description: "Status siswa magang berhasil diperbarui",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Update siswa magang status mutation failed:', error);
      toast({
        title: "Error",  
        description: error instanceof Error ? error.message : "Failed to update siswa magang status",
        variant: "destructive",
      });
    },
  });

  return {
    createSiswaMagang: createSiswaMagang.mutateAsync,
    updateSiswaMagang: updateSiswaMagang.mutateAsync,
    deleteSiswaMagang: deleteSiswaMagang.mutateAsync,
    updateSiswaMagangStatus: updateSiswaMagangStatus.mutateAsync,
    isCreating: createSiswaMagang.isPending,
    isUpdating: updateSiswaMagang.isPending,
    isDeleting: deleteSiswaMagang.isPending,
    isUpdatingStatus: updateSiswaMagangStatus.isPending,
  };
}
