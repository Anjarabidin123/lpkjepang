
import { jobOrderTable } from '@/lib/localStorage/tables';
import { JobOrder, JobOrderInsert } from '@/types/jobOrder';
import { dataMappers } from './dataMappers';

export const createOperations = {
  async createJobOrder(data: JobOrderInsert): Promise<JobOrder> {
    try {
      console.log('Creating job order in localStorage with data:', data);

      // Validate required fields
      if (!data.nama_job_order?.trim()) {
        throw new Error('Nama job order harus diisi');
      }

      // Prepare data for insertion
      const insertData = {
        nama_job_order: data.nama_job_order.trim(),
        kumiai_id: data.kumiai_id || null,
        jenis_kerja_id: data.jenis_kerja_id || null,
        catatan: data.catatan?.trim() || null,
        status: data.status || 'Aktif'
      };

      const result = jobOrderTable.create(insertData as any);
      
      if (!result) {
        throw new Error('Gagal membuat job order di localStorage');
      }

      console.log('Job order created successfully in localStorage:', result);
      return dataMappers.mapJobOrderData(result);
    } catch (err) {
      console.error('Error in createJobOrder:', err);
      throw err instanceof Error ? err : new Error('Terjadi kesalahan tidak dikenal saat membuat job order');
    }
  }
};
