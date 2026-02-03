import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export interface TaskStats {
    totalTasks: number;
    inProgress: number;
    completed: number;
    overdue: number;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigned_to?: number;
    created_by?: number;
    due_date?: string;
    completed_at?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    assignedUser?: any;
    creator?: any;
}

export function useTaskStats() {
    return useQuery<TaskStats>({
        queryKey: ['task-stats'],
        queryFn: async () => {
            const response = await authFetch(endpoints.tasks.stats);
            if (!response.ok) throw new Error('Failed to fetch task stats');
            return response.json();
        },
        staleTime: 1000 * 60 * 1, // 1 minute
    });
}

export function useTasks(filters?: {
    status?: string;
    priority?: string;
    search?: string;
}) {
    return useQuery<Task[]>({
        queryKey: ['tasks', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            if (filters?.priority) params.append('priority', filters.priority);
            if (filters?.search) params.append('search', filters.search);

            const url = `${endpoints.tasks.list}${params.toString() ? '?' + params.toString() : ''}`;
            const response = await authFetch(url);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            return response.json();
        },
        staleTime: 1000 * 60 * 1, // 1 minute
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Task>) => {
            const response = await authFetch(endpoints.tasks.list, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create task');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task-stats'] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Task> }) => {
            const response = await authFetch(endpoints.tasks.detail(id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to update task');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task-stats'] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const response = await authFetch(endpoints.tasks.detail(id), {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete task');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['task-stats'] });
        },
    });
}
