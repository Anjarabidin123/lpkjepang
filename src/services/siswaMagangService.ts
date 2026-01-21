
import { 
  siswaMagangTable, 
  siswaTable, 
  kumiaiTable, 
  perusahaanTable, 
  programTable, 
  jenisKerjaTable, 
  posisiKerjaTable, 
  lpkMitraTable, 
  demografiProvincesTable, 
  demografiRegenciesTable 
} from '@/lib/localStorage/tables';
import type { SiswaMagang, CreateSiswaMagangData, UpdateSiswaMagangData } from '@/types/siswaMagang';

const joinRelations = (data: any): SiswaMagang => {
  const siswa = siswaTable.getById(data.siswa_id) || { id: data.siswa_id, nama: 'Unknown', nik: '', email: '', telepon: '' };
  const kumiai = data.kumiai_id ? kumiaiTable.getById(data.kumiai_id) : null;
  const perusahaan = data.perusahaan_id ? perusahaanTable.getById(data.perusahaan_id) : null;
  const program = data.program_id ? programTable.getById(data.program_id) : null;
  const jenis_kerja = data.jenis_kerja_id ? jenisKerjaTable.getById(data.jenis_kerja_id) : null;
  const posisi_kerja = data.posisi_kerja_id ? posisiKerjaTable.getById(data.posisi_kerja_id) : null;
  const lpk_mitra = data.lpk_mitra_id ? lpkMitraTable.getById(data.lpk_mitra_id) : null;
  const provinsi = data.demografi_province_id ? demografiProvincesTable.getById(data.demografi_province_id) : { id: '', nama: '', kode: '' };
  const kabupaten = data.demografi_regency_id ? demografiRegenciesTable.getById(data.demografi_regency_id) : { id: '', nama: '', kode: '' };

  return {
    ...data,
    siswa,
    kumiai,
    perusahaan,
    program,
    jenis_kerja,
    posisi_kerja,
    lpk_mitra,
    provinsi,
    kabupaten
  } as SiswaMagang;
};

export const siswaMagangService = {
  async fetchAll(): Promise<SiswaMagang[]> {
    console.log('Fetching siswa magang data from localStorage...');
    try {
      const data = siswaMagangTable.getAll();
      const mappedData = data.map(joinRelations);
      
      console.log('Siswa magang data fetched successfully:', mappedData.length, 'records');
      return mappedData;
    } catch (err) {
      console.error('Fetch all error:', err);
      throw err;
    }
  },

  async fetchById(id: string): Promise<SiswaMagang | null> {
    console.log('Fetching siswa magang by ID from localStorage:', id);
    try {
      const data = siswaMagangTable.getById(id);
      if (!data) return null;
      
      return joinRelations(data);
    } catch (err) {
      console.error('Fetch by ID error:', err);
      throw err;
    }
  },

  async create(newSiswaMagang: CreateSiswaMagangData): Promise<SiswaMagang> {
    console.log('Creating siswa magang in localStorage with data:', newSiswaMagang);
    
    if (!newSiswaMagang.siswa_id) {
      throw new Error('Siswa ID is required');
    }

    const cleanData = {
      siswa_id: newSiswaMagang.siswa_id,
      kumiai_id: newSiswaMagang.kumiai_id || null,
      perusahaan_id: newSiswaMagang.perusahaan_id || null,
      program_id: newSiswaMagang.program_id || null,
      jenis_kerja_id: newSiswaMagang.jenis_kerja_id || null,
      posisi_kerja_id: newSiswaMagang.posisi_kerja_id || null,
      lpk_mitra_id: newSiswaMagang.lpk_mitra_id || null,
      demografi_province_id: newSiswaMagang.demografi_province_id || null,
      demografi_regency_id: newSiswaMagang.demografi_regency_id || null,
      lokasi: newSiswaMagang.lokasi || null,
      tanggal_mulai_kerja: newSiswaMagang.tanggal_mulai_kerja || null,
      tanggal_pulang_kerja: newSiswaMagang.tanggal_pulang_kerja || null,
      gaji: newSiswaMagang.gaji || null,
      status_magang: newSiswaMagang.status_magang || 'Aktif',
      avatar_url: newSiswaMagang.avatar_url || null,
    };

    try {
      const data = siswaMagangTable.create(cleanData);
      console.log('Siswa magang created successfully:', data);
      return joinRelations(data);
    } catch (err) {
      console.error('Create mutation error:', err);
      throw err;
    }
  },

  async update({ id, ...updates }: UpdateSiswaMagangData): Promise<SiswaMagang> {
    console.log('Updating siswa magang in localStorage:', id, updates);
    
    if (!id) {
      throw new Error('ID is required for update');
    }
    
    try {
      const { 
        created_at, 
        updated_at, 
        siswa, 
        kumiai, 
        perusahaan, 
        program, 
        jenis_kerja, 
        posisi_kerja, 
        lpk_mitra, 
        provinsi, 
        kabupaten, 
        ...updateData 
      } = updates as any;
      
      const cleanUpdateData = Object.fromEntries(
        Object.entries(updateData).map(([key, value]) => [
          key, 
          value === '' ? null : value
        ])
      );

      const data = siswaMagangTable.update(id, cleanUpdateData);
      if (!data) throw new Error('Failed to update: Record not found');
      
      console.log('Siswa magang updated successfully:', data);
      return joinRelations(data);
    } catch (err) {
      console.error('Update mutation error:', err);
      throw err;
    }
  },

  async delete(id: string): Promise<string> {
    console.log('Deleting siswa magang from localStorage:', id);
    
    if (!id) {
      throw new Error('ID is required for delete');
    }
    
    try {
      const success = siswaMagangTable.delete(id);
      if (!success) throw new Error('Failed to delete');
      
      console.log('Siswa magang deleted successfully:', id);
      return id;
    } catch (err) {
      console.error('Delete mutation error:', err);
      throw err;
    }
  },

  async updateStatus(id: string, status: string): Promise<SiswaMagang> {
    console.log('Updating siswa magang status in localStorage:', id, status);
    
    if (!id || !status) {
      throw new Error('ID and status are required');
    }
    
    try {
      const data = siswaMagangTable.update(id, { status_magang: status });
      if (!data) throw new Error('Failed to update status: Record not found');
      
      console.log('Siswa magang status updated successfully:', data);
      return joinRelations(data);
    } catch (err) {
      console.error('Status update error:', err);
      throw err;
    }
  },

  setupRealtimeSubscription(callback: (payload: any) => void) {
    console.log('Real-time subscription for localStorage not implemented, using polling or simple event emitter if needed');
    return () => {
      console.log('Cleaning up real-time simulation');
    };
  }
};
