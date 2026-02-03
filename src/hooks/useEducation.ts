import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authFetch } from '@/lib/api-client';

export interface Attendance {
    id: string;
    siswa_id: string;
    siswa?: { nama: string; nik: string };
    date: string;
    status: 'hadiir' | 'izin' | 'sakit' | 'alpha';
    notes?: string;
}

export interface Grade {
    id: string;
    siswa_id: string;
    siswa?: { nama: string; nik: string };
    subject: string;
    score: number;
    exam_date: string;
    result: 'pass' | 'fail' | 'remidi';
    teacher_comments?: string;
}

export interface ClassSchedule {
    id: string;
    subject: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    room?: string;
    teacher_name?: string;
    notes?: string;
    is_active: boolean;
}

export function useEducation() {
    const queryClient = useQueryClient();

    // Queries
    const { data: attendance, isLoading: loadingAttendance } = useQuery({
        queryKey: ['education-attendance'],
        queryFn: async () => {
            try {
                const resp = await authFetch('/education/attendance');
                if (!resp.ok) return [];
                const data = await resp.json();
                return Array.isArray(data) ? data : (data.data || []);
            } catch (e) {
                console.error('Fetch attendance error:', e);
                return [];
            }
        }
    });

    const { data: grades, isLoading: loadingGrades } = useQuery({
        queryKey: ['education-grades'],
        queryFn: async () => {
            try {
                const resp = await authFetch('/education/grades');
                if (!resp.ok) return [];
                const data = await resp.json();
                return Array.isArray(data) ? data : (data.data || []);
            } catch (e) {
                console.error('Fetch grades error:', e);
                return [];
            }
        }
    });

    const { data: schedules, isLoading: loadingSchedules } = useQuery({
        queryKey: ['education-schedules'],
        queryFn: async () => {
            try {
                const resp = await authFetch('/education/schedules');
                if (!resp.ok) return [];
                const data = await resp.json();
                return Array.isArray(data) ? data : (data.data || []);
            } catch (e) {
                console.error('Fetch schedules error:', e);
                return [];
            }
        }
    });

    // Mutations
    const bulkAttendance = useMutation({
        mutationFn: async (data: any[]) => {
            const resp = await authFetch('/education/bulk-attendance', {
                method: 'POST',
                body: JSON.stringify({ attendance: data })
            });
            return resp.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['education-attendance'] });
        }
    });

    const addGrade = useMutation({
        mutationFn: async (data: any) => {
            const resp = await authFetch('/education/grades', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            return resp.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['education-grades'] });
        }
    });

    const addSchedule = useMutation({
        mutationFn: async (data: any) => {
            const resp = await authFetch('/education/schedules', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            return resp.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['education-schedules'] });
        }
    });

    const deleteSchedule = useMutation({
        mutationFn: async (id: string) => {
            const resp = await authFetch(`/education/schedules/${id}`, {
                method: 'DELETE'
            });
            return resp.ok;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['education-schedules'] });
        }
    });

    return {
        attendance: attendance || [],
        grades: grades || [],
        schedules: schedules || [],
        loading: loadingAttendance || loadingGrades || loadingSchedules,
        bulkAttendance,
        addGrade,
        addSchedule,
        deleteSchedule
    };
}
