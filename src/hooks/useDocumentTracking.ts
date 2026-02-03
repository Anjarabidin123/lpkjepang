import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '@/lib/api-client';

export interface DocumentTracking {
    id: string;
    siswa_id: string;
    siswa?: {
        nama: string;
        nik: string;
    };
    passport_status: 'not_started' | 'in_progress' | 'ready' | 'expired';
    passport_expiry?: string;
    mcu_status: 'not_started' | 'done' | 'expired';
    mcu_date?: string;
    language_cert_status: 'not_started' | 'not_passed' | 'passed';
    language_cert_level?: string;
    coe_status: 'not_submitted' | 'submitted' | 'approved' | 'rejected';
    coe_number?: string;
    coe_issue_date?: string;
    visa_status: 'not_applied' | 'applied' | 'granted' | 'denied';
    visa_expiry?: string;
    flight_status: 'not_booked' | 'booked' | 'departed';
    departure_datetime?: string;
    notes?: string;
    updated_at: string;
}

export function useDocumentTracking() {
    const queryClient = useQueryClient();

    const { data: trackings, isLoading } = useQuery({
        queryKey: ['document-tracking'],
        queryFn: async () => {
            const response = await authFetch('/document-tracking');
            if (!response.ok) throw new Error('Failed to fetch trackings');
            return response.json() as Promise<DocumentTracking[]>;
        },
    });

    const { data: stats } = useQuery({
        queryKey: ['document-tracking-stats'],
        queryFn: async () => {
            const response = await authFetch('/document-tracking/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            return response.json();
        },
    });

    const updateTracking = useMutation({
        mutationFn: async (data: Partial<DocumentTracking>) => {
            const response = await authFetch('/document-tracking', {
                method: 'POST',
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update tracking');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document-tracking'] });
            queryClient.invalidateQueries({ queryKey: ['document-tracking-stats'] });
        },
    });

    return {
        trackings: trackings || [],
        stats,
        isLoading,
        updateTracking,
    };
}
