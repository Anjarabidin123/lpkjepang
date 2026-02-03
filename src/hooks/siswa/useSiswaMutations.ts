
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { siswaService } from '@/services/siswaService';
import { Siswa } from './types';

const SISWA_QUERY_KEY = 'siswa';

export function useSiswaMutations() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const createMutation = useMutation({
        mutationFn: (newSiswa: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>) =>
            siswaService.create(newSiswa),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SISWA_QUERY_KEY] });
            toast({
                title: "Berhasil",
                description: "Data siswa berhasil ditambahkan",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: Partial<Siswa> & { id: string }) =>
            siswaService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SISWA_QUERY_KEY] });
            toast({
                title: "Berhasil",
                description: "Data siswa berhasil diperbarui",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            siswaService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SISWA_QUERY_KEY] });
            toast({
                title: "Berhasil",
                description: "Data siswa berhasil dihapus",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return {
        createSiswa: createMutation.mutate,
        updateSiswa: updateMutation.mutate,
        deleteSiswa: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
