import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export interface RecruitmentStats {
    newApplications: number;
    inReview: number;
    accepted: number;
    successRate: number;
}

export interface RecruitmentApplication {
    id: number;
    application_number: string;
    siswa_id: number;
    program_id?: number;
    status: 'new' | 'review' | 'interview' | 'accepted' | 'rejected' | 'withdrawn';
    application_date: string;
    interview_date?: string;
    interview_notes?: string;
    score?: number;
    rejection_reason?: string;
    reviewed_by?: number;
    reviewed_at?: string;
    created_at: string;
    updated_at: string;
    siswa?: any;
    program?: any;
    reviewer?: any;
}

export function useRecruitmentStats() {
    return useQuery<RecruitmentStats>({
        queryKey: ['recruitment-stats'],
        queryFn: async () => {
            const response = await authFetch(endpoints.recruitment.stats);
            if (!response.ok) throw new Error('Failed to fetch recruitment stats');
            return response.json();
        },
        staleTime: 1000 * 60 * 1, // 1 minute
    });
}

export function useRecruitmentApplications(filters?: {
    status?: string;
    program_id?: string;
    search?: string;
}) {
    return useQuery<RecruitmentApplication[]>({
        queryKey: ['recruitment-applications', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            if (filters?.program_id) params.append('program_id', filters.program_id);
            if (filters?.search) params.append('search', filters.search);

            const url = `${endpoints.recruitment.list}${params.toString() ? '?' + params.toString() : ''}`;
            const response = await authFetch(url);
            if (!response.ok) throw new Error('Failed to fetch applications');
            return response.json();
        },
        staleTime: 1000 * 60 * 1, // 1 minute
    });
}

export function useCreateApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<RecruitmentApplication>) => {
            const response = await authFetch(endpoints.recruitment.list, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create application');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitment-applications'] });
            queryClient.invalidateQueries({ queryKey: ['recruitment-stats'] });
        },
    });
}

export function useUpdateApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<RecruitmentApplication> }) => {
            const response = await authFetch(endpoints.recruitment.detail(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update application');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitment-applications'] });
            queryClient.invalidateQueries({ queryKey: ['recruitment-stats'] });
        },
    });
}

export function useDeleteApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await authFetch(endpoints.recruitment.detail(id), {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete application');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recruitment-applications'] });
            queryClient.invalidateQueries({ queryKey: ['recruitment-stats'] });
        },
    });
}
