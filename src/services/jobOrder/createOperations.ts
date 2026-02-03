
// import { jobOrderTable } from '@/lib/localStorage/tables';
import { JobOrder, JobOrderInsert } from '@/types/jobOrder';
import { dataMappers } from './dataMappers';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export const createOperations = {
  async createJobOrder(data: JobOrderInsert): Promise<JobOrder> {
    try {
      console.log('Creating job order in Laravel API with data:', data);

      const response = await authFetch(endpoints.jobOrders, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Gagal membuat job order');
      }

      const result = await response.json();
      return dataMappers.mapJobOrderData(result);
    } catch (err) {
      console.error('Error in createJobOrder:', err);
      throw err instanceof Error ? err : new Error('Terjadi kesalahan tidak dikenal saat membuat job order');
    }
  }
};
