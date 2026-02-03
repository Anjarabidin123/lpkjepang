import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export interface ReportStats {
    totalReports: number;
    monthlyGrowth: number;
    accuracyRate: number;
}

export interface AvailableReport {
    id: string;
    name: string;
    description: string;
    available: boolean;
    count: number;
}

export interface RecentReport {
    id: string;
    name: string;
    type: string;
    generated_at: string;
    date: string;
}

export function useReportStats() {
    return useQuery<ReportStats>({
        queryKey: ['report-stats'],
        queryFn: async () => {
            const response = await authFetch(endpoints.reports.stats);
            if (!response.ok) throw new Error('Failed to fetch report stats');
            return response.json();
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

export function useAvailableReports() {
    return useQuery<AvailableReport[]>({
        queryKey: ['available-reports'],
        queryFn: async () => {
            const response = await authFetch(endpoints.reports.available);
            if (!response.ok) throw new Error('Failed to fetch available reports');
            return response.json();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useRecentReports() {
    return useQuery<RecentReport[]>({
        queryKey: ['recent-reports'],
        queryFn: async () => {
            const response = await authFetch(endpoints.reports.recent);
            if (!response.ok) throw new Error('Failed to fetch recent reports');
            return response.json();
        },
        staleTime: 1000 * 60 * 1, // 1 minute
    });
}

export function useGenerateReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (type: string) => {
            const response = await authFetch(endpoints.reports.generate(type), {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to generate report');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recent-reports'] });
            queryClient.invalidateQueries({ queryKey: ['report-stats'] });
        },
    });
}
