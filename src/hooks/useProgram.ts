
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { programTable } from '@/lib/localStorage/tables';
import { useToast } from '@/hooks/use-toast';

interface Program {
  id: string;
  nama: string;
  kode: string;
  deskripsi: string | null;
  durasi: number | null;
  created_at: string;
  updated_at: string;
}

type ProgramInsert = Omit<Program, 'id' | 'created_at' | 'updated_at'>;
type ProgramUpdate = Partial<ProgramInsert>;

export function useProgram() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: program, isLoading, error } = useQuery({
    queryKey: ['program'],
    queryFn: async () => {
      console.log('Fetching program data from localStorage...');
      const data = programTable.getAll();
      console.log('Program data fetched successfully:', data?.length || 0, 'records');
      return data as Program[];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProgramInsert) => {
      const result = programTable.create(data);
      return result as Program;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program'] });
      toast({
        title: "Berhasil",
        description: "Program berhasil ditambahkan",
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
    mutationFn: async ({ id, data }: { id: string; data: ProgramUpdate }) => {
      const result = programTable.update(id, data);
      if (!result) throw new Error('Program tidak ditemukan');
      return result as Program;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program'] });
      toast({
        title: "Berhasil",
        description: "Program berhasil diperbarui",
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
    mutationFn: async (id: string) => {
      const success = programTable.delete(id);
      if (!success) throw new Error('Gagal menghapus program');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program'] });
      toast({
        title: "Berhasil",
        description: "Program berhasil dihapus",
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
    program,
    isLoading,
    error,
    createProgram: createMutation.mutate,
    updateProgram: updateMutation.mutate,
    deleteProgram: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
