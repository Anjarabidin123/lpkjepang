
import { useQuery } from '@tanstack/react-query';

export interface Country {
    id: string;
    nama: string;
    kode: string;
}

export function useDemografiCountries() {
    const { data: countries = [], isLoading, error } = useQuery({
        queryKey: ['countries'],
        queryFn: async () => {
            // Mocked for now as Laravel doesn't have a countries endpoint yet
            return [
                { id: 'ID', nama: 'Indonesia', kode: 'ID' },
                { id: 'JP', nama: 'Jepang', kode: 'JP' },
            ] as Country[];
        },
    });

    return {
        countries,
        isLoading,
        error,
    };
}
