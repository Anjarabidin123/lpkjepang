
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export const deleteOperations = {
  async deleteJobOrder(id: string): Promise<void> {
    try {
      console.log('Deleting job order from Laravel API:', id);

      if (!id?.trim()) throw new Error('ID job order tidak valid');

      const response = await authFetch(`${endpoints.jobOrders}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus job order');
      }

      console.log('Job order deleted successfully from API:', id);
    } catch (err) {
      console.error('Error in deleteJobOrder:', err);
      throw err instanceof Error ? err : new Error('Terjadi kesalahan tidak dikenal saat menghapus job order');
    }
  }
};
