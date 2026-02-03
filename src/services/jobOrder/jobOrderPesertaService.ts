
import { JobOrderPeserta } from '@/types/jobOrder';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export const jobOrderPesertaService = {
  async fetchByJobOrderId(jobOrderId: string): Promise<JobOrderPeserta[]> {
    try {
      console.log('jobOrderPesertaService - Fetching from API for job order:', jobOrderId);
      const response = await authFetch(`${endpoints.jobOrderPeserta}?job_order_id=${jobOrderId}`);
      if (!response.ok) throw new Error('Failed to fetch participants');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        job_order_id: item.job_order_id.toString(),
        siswa_id: item.siswa_id.toString(),
        siswa: item.siswa ? { ...item.siswa, id: item.siswa.id.toString() } : null
      })) as JobOrderPeserta[];
    } catch (error) {
      console.error('jobOrderPesertaService - Error fetching participants:', error);
      return [];
    }
  },

  async addPeserta(siswaIds: string[], jobOrderId: string): Promise<JobOrderPeserta[]> {
    try {
      console.log('jobOrderPesertaService - Adding participants via API:', siswaIds);

      const results: JobOrderPeserta[] = [];

      for (const siswaId of siswaIds) {
        const response = await authFetch(endpoints.jobOrderPeserta, {
          method: 'POST',
          body: JSON.stringify({
            job_order_id: jobOrderId,
            siswa_id: siswaId,
            status: 'Pending'
          })
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            ...data,
            id: data.id.toString(),
            job_order_id: data.job_order_id.toString(),
            siswa_id: data.siswa_id.toString()
          });
        } else {
          console.warn(`Failed to add siswa ${siswaId}`);
        }
      }

      return results;
    } catch (error) {
      console.error('jobOrderPesertaService - Error adding participants:', error);
      throw error;
    }
  },

  async updatePeserta(id: string, updates: { status: string, keterangan: string }): Promise<JobOrderPeserta> {
    try {
      console.log('jobOrderPesertaService - Updating participant via API:', id);

      const response = await authFetch(`${endpoints.jobOrderPeserta}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update participant');
      const data = await response.json();
      return {
        ...data,
        id: data.id.toString(),
        job_order_id: data.job_order_id.toString(),
        siswa_id: data.siswa_id.toString()
      } as JobOrderPeserta;
    } catch (error) {
      console.error('jobOrderPesertaService - Error updating participant:', error);
      throw error;
    }
  },

  async deletePeserta(id: string): Promise<boolean> {
    try {
      console.log('jobOrderPesertaService - Deleting participant via API:', id);
      const response = await authFetch(`${endpoints.jobOrderPeserta}/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('jobOrderPesertaService - Error deleting participant:', error);
      throw error;
    }
  }
};
