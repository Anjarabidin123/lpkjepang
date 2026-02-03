
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { programTable } from '@/lib/localStorage/tables';
import { useToast } from '@/hooks/use-toast';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

interface Program {
  id: string;
  nama: string;
  kode: string;
  deskripsi: string | null;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  status: string | null;
  durasi: number | null;
  satuan_durasi: string | null;
  biaya: number | null;
  kuota: number | null;
  peserta_terdaftar: number | null;
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
      console.log('Fetching program data from Laravel API...');
      const response = await authFetch(endpoints.programs);
      if (!response.ok) throw new Error('Failed to fetch programs');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString()
      })) as Program[];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProgramInsert) => {
      const response = await authFetch(endpoints.programs, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menambahkan program');
      }
      const result = await response.json();
      return {
        ...result,
        id: result.id.toString()
      } as Program;
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
      const response = await authFetch(`${endpoints.programs}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal memperbarui program');
      }
      const result = await response.json();
      return {
        ...result,
        id: result.id.toString()
      } as Program;
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
      const response = await authFetch(`${endpoints.programs}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Gagal menghapus program');
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
