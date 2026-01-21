
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LpkMitraService } from '@/services/lpkMitraService';
import { CreateLpkMitraData, UpdateLpkMitraData } from '@/types/lpkMitra';
import { toast } from 'sonner';

export function useLpkMitra() {
  const queryClient = useQueryClient();

  const { data: lpkMitras = [], isLoading, error, refetch } = useQuery({
    queryKey: ['lpk-mitra'],
    queryFn: LpkMitraService.fetchAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateLpkMitraData) => LpkMitraService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpk-mitra'] });
      toast.success('LPK Mitra berhasil ditambahkan');
    },
    onError: (error) => {
      console.error('Error creating LPK Mitra:', error);
      toast.error('Gagal menambahkan LPK Mitra');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLpkMitraData }) => 
      LpkMitraService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpk-mitra'] });
      toast.success('LPK Mitra berhasil diupdate');
    },
    onError: (error) => {
      console.error('Error updating LPK Mitra:', error);
      toast.error('Gagal mengupdate LPK Mitra');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => LpkMitraService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpk-mitra'] });
      toast.success('LPK Mitra berhasil dihapus');
    },
    onError: (error) => {
      console.error('Error deleting LPK Mitra:', error);
      toast.error('Gagal menghapus LPK Mitra');
    },
  });

  return {
    lpkMitras,
    isLoading,
    error,
    refetch,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
