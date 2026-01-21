
import { jobOrderTable, kumiaiTable, jenisKerjaTable, jobOrderPesertaTable } from '@/lib/localStorage/tables';
import { JobOrder } from '@/types/jobOrder';

export const fetchOperations = {
  async fetchJobOrders(): Promise<JobOrder[]> {
    try {
      console.log('fetchJobOrders - Starting fetch from localStorage...');
      
      const jobOrdersData = jobOrderTable.getAll();
      const kumiaiData = kumiaiTable.getAll();
      const jenisKerjaData = jenisKerjaTable.getAll();
      const pesertaData = jobOrderPesertaTable.getAll();

      console.log('fetchJobOrders - Raw data:', jobOrdersData?.length || 0, 'records');

      if (!jobOrdersData) {
        console.log('fetchJobOrders - No data returned');
        return [];
      }

      // Join data manually for localStorage
      const jobOrdersWithPeserta = jobOrdersData.map((jobOrder: any) => {
        const kumiai = kumiaiData.find(k => k.id === jobOrder.kumiai_id);
        const jenisKerja = jenisKerjaData.find(jk => jk.id === jobOrder.jenis_kerja_id);
        const count = pesertaData.filter(p => p.job_order_id === jobOrder.id).length;

        return {
          ...jobOrder,
          kumiai: kumiai ? { id: kumiai.id, nama: kumiai.nama, kode: kumiai.kode } : null,
          jenis_kerja: jenisKerja ? { id: jenisKerja.id, nama: jenisKerja.nama, kode: jenisKerja.kode } : null,
          peserta_count: count
        } as JobOrder;
      });

      console.log('fetchJobOrders - Processed job orders with peserta count:', jobOrdersWithPeserta.length);
      return jobOrdersWithPeserta;

    } catch (error) {
      console.error('fetchJobOrders - Unexpected error:', error);
      throw error;
    }
  }
};
