
// import { jobOrderTable } from '@/lib/localStorage/tables';
import { JobOrder, JobOrderUpdate } from '@/types/jobOrder';
import { dataMappers } from './dataMappers';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export const updateOperations = {
  async updateJobOrder(id: string, data: JobOrderUpdate): Promise<JobOrder> {
    try {
      console.log('Updating job order in Laravel API:', id, 'with data:', data);

      if (!id?.trim()) throw new Error('ID job order tidak valid');

      const response = await authFetch(`${endpoints.jobOrders}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui job order');
      }

      const result = await response.json();
      return dataMappers.mapJobOrderData(result);
    } catch (err) {
      console.error('Error in updateJobOrder:', err);
      throw err instanceof Error ? err : new Error('Terjadi kesalahan tidak dikenal saat memperbarui job order');
    }
  }
};
