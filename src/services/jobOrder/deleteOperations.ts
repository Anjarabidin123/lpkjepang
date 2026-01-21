
import { jobOrderTable } from '@/lib/localStorage/tables';

export const deleteOperations = {
  async deleteJobOrder(id: string): Promise<void> {
    try {
      console.log('Deleting job order from localStorage:', id);

      if (!id?.trim()) {
        throw new Error('ID job order tidak valid');
      }

      const success = jobOrderTable.delete(id);
      
      if (!success) {
        throw new Error('Gagal menghapus job order di localStorage: Data tidak ditemukan');
      }

      console.log('Job order deleted successfully from localStorage:', id);
    } catch (err) {
      console.error('Error in deleteJobOrder:', err);
      throw err instanceof Error ? err : new Error('Terjadi kesalahan tidak dikenal saat menghapus job order');
    }
  }
};
