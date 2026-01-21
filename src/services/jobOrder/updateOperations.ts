
import { jobOrderTable } from '@/lib/localStorage/tables';
import { JobOrder, JobOrderUpdate } from '@/types/jobOrder';
import { dataMappers } from './dataMappers';

export const updateOperations = {
  async updateJobOrder(id: string, data: JobOrderUpdate): Promise<JobOrder> {
    try {
      console.log('Updating job order in localStorage:', id, 'with data:', data);

      if (!id?.trim()) {
        throw new Error('ID job order tidak valid');
      }

      // Prepare data for update (only include defined fields)
      const updateData: Record<string, any> = {};
      
      if (data.nama_job_order !== undefined) {
        if (!data.nama_job_order?.trim()) {
          throw new Error('Nama job order harus diisi');
        }
        updateData.nama_job_order = data.nama_job_order.trim();
      }
      
      if (data.kumiai_id !== undefined) {
        updateData.kumiai_id = data.kumiai_id || null;
      }
      
      if (data.jenis_kerja_id !== undefined) {
        updateData.jenis_kerja_id = data.jenis_kerja_id || null;
      }
      
      if (data.catatan !== undefined) {
        updateData.catatan = data.catatan?.trim() || null;
      }
      
      if (data.status !== undefined) {
        updateData.status = data.status || 'Aktif';
      }

      const result = jobOrderTable.update(id, updateData);
      
      if (!result) {
        throw new Error('Gagal memperbarui job order di localStorage: Data tidak ditemukan');
      }

      console.log('Job order updated successfully in localStorage:', result);
      return dataMappers.mapJobOrderData(result);
    } catch (err) {
      console.error('Error in updateJobOrder:', err);
      throw err instanceof Error ? err : new Error('Terjadi kesalahan tidak dikenal saat memperbarui job order');
    }
  }
};
