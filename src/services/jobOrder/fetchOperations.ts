import type { JobOrder } from '@/types/jobOrder';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export const fetchOperations = {
  async fetchJobOrders(): Promise<JobOrder[]> {
    try {
      console.log('fetchJobOrders - Starting fetch from Laravel API...');
      const response = await authFetch(endpoints.jobOrders);
      if (!response.ok) throw new Error('Failed to fetch job orders');

      const data = await response.json();
      console.log('fetchJobOrders - Fetched:', data.length);

      // Ensure IDs are strings and use dataMappers for consistency if needed, 
      // but simple mapping here is fine too as long as it matches JobOrder type.
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        kumiai_id: item.kumiai_id?.toString() || null,
        jenis_kerja_id: item.jenis_kerja_id?.toString() || null,
      }));
    } catch (error) {
      console.error('fetchJobOrders - Unexpected error:', error);
      return [];
    }
  }
};
