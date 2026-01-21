
import { supabase } from '@/integrations/supabase/client';
import { JobOrder } from '@/types/jobOrder';

export const dataMappers = {
  async enrichJobOrdersWithRelations(jobOrdersData: any[]): Promise<JobOrder[]> {
    const jobOrdersWithRelations: JobOrder[] = [];
    
    for (const jobOrder of jobOrdersData) {
      if (!jobOrder || !jobOrder.id || !jobOrder.nama_job_order) {
        console.warn('Invalid job order data:', jobOrder);
        continue;
      }

      let kumiai = null;
      let jenis_kerja = null;

      // Fetch kumiai if exists
      if (jobOrder.kumiai_id) {
        try {
          const { data: kumiaiData, error: kumiaiError } = await supabase
            .from('kumiai')
            .select('id, nama, kode')
            .eq('id', jobOrder.kumiai_id)
            .single();
          
          if (!kumiaiError && kumiaiData) {
            kumiai = kumiaiData;
          }
        } catch (err) {
          console.log('Kumiai not found for job order:', jobOrder.id);
        }
      }

      // Fetch jenis_kerja if exists
      if (jobOrder.jenis_kerja_id) {
        try {
          const { data: jenisKerjaData, error: jenisKerjaError } = await supabase
            .from('jenis_kerja')
            .select('id, nama, kode')
            .eq('id', jobOrder.jenis_kerja_id)
            .single();
          
          if (!jenisKerjaError && jenisKerjaData) {
            jenis_kerja = jenisKerjaData;
          }
        } catch (err) {
          console.log('Jenis kerja not found for job order:', jobOrder.id);
        }
      }

      // Construct job order with proper typing
      const processedJobOrder: JobOrder = {
        id: jobOrder.id,
        nama_job_order: jobOrder.nama_job_order,
        kumiai_id: jobOrder.kumiai_id || null,
        jenis_kerja_id: jobOrder.jenis_kerja_id || null,
        catatan: jobOrder.catatan || null,
        status: jobOrder.status || 'Aktif',
        kuota: jobOrder.kuota || null,
        created_at: jobOrder.created_at || null,
        updated_at: jobOrder.updated_at || null,
        kumiai,
        jenis_kerja
      };

      jobOrdersWithRelations.push(processedJobOrder);
    }

    console.log('Job orders processed successfully:', jobOrdersWithRelations.length);
    return jobOrdersWithRelations;
  },

  mapJobOrderData(result: any): JobOrder {
    return {
      id: result.id,
      nama_job_order: result.nama_job_order,
      kumiai_id: result.kumiai_id || null,
      jenis_kerja_id: result.jenis_kerja_id || null,
      catatan: result.catatan || null,
      status: result.status || 'Aktif',
      kuota: result.kuota || null,
      created_at: result.created_at || null,
      updated_at: result.updated_at || null,
      kumiai: null,
      jenis_kerja: null
    };
  }
};
