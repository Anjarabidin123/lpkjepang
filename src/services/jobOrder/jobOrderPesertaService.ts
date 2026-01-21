
import { jobOrderPesertaTable, siswaTable } from '@/lib/localStorage/tables';
import { JobOrderPeserta } from '@/types/jobOrder';

export const jobOrderPesertaService = {
  async fetchByJobOrderId(jobOrderId: string): Promise<JobOrderPeserta[]> {
    try {
      console.log('jobOrderPesertaService - Fetching for job order:', jobOrderId);
      
      const allPeserta = jobOrderPesertaTable.getAll();
      const allSiswa = siswaTable.getAll();
      
      const filteredPeserta = allPeserta.filter(p => p.job_order_id === jobOrderId);
      
      const enrichedPeserta = filteredPeserta.map(peserta => {
        const siswa = allSiswa.find(s => s.id === peserta.siswa_id);
        return {
          ...peserta,
          siswa: siswa || null
        } as JobOrderPeserta;
      });
      
      console.log(`jobOrderPesertaService - Found ${enrichedPeserta.length} participants`);
      return enrichedPeserta;
    } catch (error) {
      console.error('jobOrderPesertaService - Error fetching participants:', error);
      throw error;
    }
  },

  async addPeserta(siswaIds: string[], jobOrderId: string): Promise<JobOrderPeserta[]> {
    try {
      console.log('jobOrderPesertaService - Adding participants:', siswaIds, 'to job order:', jobOrderId);
      
      const results: JobOrderPeserta[] = [];
      
      for (const siswaId of siswaIds) {
        // Check if already exists to avoid duplicates
        const existing = jobOrderPesertaTable.getAll().find(
          p => p.job_order_id === jobOrderId && p.siswa_id === siswaId
        );
        
        if (existing) {
          console.warn(`Siswa ${siswaId} is already a participant in job order ${jobOrderId}`);
          continue;
        }

        const newPeserta = jobOrderPesertaTable.create({
          job_order_id: jobOrderId,
          siswa_id: siswaId,
          status: 'Pending',
          keterangan: null
        } as any);
        
        results.push(newPeserta as unknown as JobOrderPeserta);
      }
      
      return results;
    } catch (error) {
      console.error('jobOrderPesertaService - Error adding participants:', error);
      throw error;
    }
  },

  async updatePeserta(id: string, updates: { status: string, keterangan: string }): Promise<JobOrderPeserta> {
    try {
      console.log('jobOrderPesertaService - Updating participant:', id, updates);
      
      const updated = jobOrderPesertaTable.update(id, updates);
      
      if (!updated) {
        throw new Error('Participant not found');
      }
      
      return updated as unknown as JobOrderPeserta;
    } catch (error) {
      console.error('jobOrderPesertaService - Error updating participant:', error);
      throw error;
    }
  },

  async deletePeserta(id: string): Promise<boolean> {
    try {
      console.log('jobOrderPesertaService - Deleting participant:', id);
      return jobOrderPesertaTable.delete(id);
    } catch (error) {
      console.error('jobOrderPesertaService - Error deleting participant:', error);
      throw error;
    }
  }
};
