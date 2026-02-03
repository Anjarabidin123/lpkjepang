
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import { authFetch } from '@/lib/api-client';

export interface Regency {
    id: string;
    nama: string;
    kode: string;
    province_id: string;
}

export function useDemografiRegencies(provinceId?: string) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: regencies = [], isLoading, error } = useQuery({
        queryKey: ['regencies', provinceId],
        queryFn: async () => {
            const url = provinceId
                ? `${endpoints.demografi.regencies}?province_id=${provinceId}`
                : endpoints.demografi.regencies;

            const response = await authFetch(url);
            if (!response.ok) throw new Error('Failed to fetch regencies');
            const data = await response.json();
            return data.map((r: any) => ({
                ...r,
                id: r.id.toString(),
                province_id: r.province_id.toString()
            })) as Regency[];
        },
        enabled: true // Always load if no provinceId, or filter on server
    });

    const createMutation = useMutation({
        mutationFn: async (newRegency: Omit<Regency, 'id'>) => {
            const response = await authFetch(endpoints.demografi.regencies, {
                method: 'POST',
                body: JSON.stringify(newRegency)
            });
            if (!response.ok) throw new Error('Failed to create regency');
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regencies'] });
            toast({ title: 'Berhasil', description: 'Kabupaten/Kota berhasil ditambahkan' });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...data }: Partial<Regency> & { id: string }) => {
            const response = await authFetch(`${endpoints.demografi.regencies}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update regency');
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regencies'] });
            toast({ title: 'Berhasil', description: 'Kabupaten/Kota berhasil diperbarui' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await authFetch(`${endpoints.demografi.regencies}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete regency');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regencies'] });
            toast({ title: 'Berhasil', description: 'Kabupaten/Kota berhasil dihapus' });
        }
    });

    return {
        regencies,
        isLoading,
        error,
        createRegency: createMutation.mutate,
        updateRegency: updateMutation.mutate,
        deleteRegency: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
