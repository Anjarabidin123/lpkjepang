
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/config/api';
import { useToast } from '@/hooks/use-toast';
import { authFetch } from '@/lib/api-client';

export interface Province {
    id: string;
    nama: string;
    kode: string;
}

export function useDemografiProvinces(countryId?: string) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: provinces = [], isLoading, error } = useQuery({
        queryKey: ['provinces', countryId],
        queryFn: async () => {
            const url = countryId
                ? `${endpoints.demografi.provinces}?country_id=${countryId}`
                : endpoints.demografi.provinces;

            const response = await authFetch(url);
            if (!response.ok) throw new Error('Failed to fetch provinces');
            const data = await response.json();
            return data.map((p: any) => ({
                ...p,
                id: p.id.toString()
            })) as Province[];
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newProvince: Omit<Province, 'id'>) => {
            const response = await authFetch(endpoints.demografi.provinces, {
                method: 'POST',
                body: JSON.stringify(newProvince)
            });
            if (!response.ok) throw new Error('Failed to create province');
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['provinces'] });
            toast({ title: 'Berhasil', description: 'Provinsi berhasil ditambahkan' });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, ...data }: Partial<Province> & { id: string }) => {
            const response = await authFetch(`${endpoints.demografi.provinces}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update province');
            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['provinces'] });
            toast({ title: 'Berhasil', description: 'Provinsi berhasil diperbarui' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await authFetch(`${endpoints.demografi.provinces}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete province');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['provinces'] });
            toast({ title: 'Berhasil', description: 'Provinsi berhasil dihapus' });
        }
    });

    return {
        provinces,
        isLoading,
        error,
        createProvince: createMutation.mutate,
        updateProvince: updateMutation.mutate,
        deleteProvince: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
