
import type { SiswaMagang, CreateSiswaMagangData, UpdateSiswaMagangData } from '@/types/siswaMagang';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

const mapSiswaMagang = (item: any): SiswaMagang => {
  if (!item) return item;
  return {
    ...item,
    id: item.id.toString(),
    siswa_id: item.siswa_id?.toString() || null,
    kumiai_id: item.kumiai_id?.toString() || null,
    perusahaan_id: item.perusahaan_id?.toString() || null,
    program_id: item.program_id?.toString() || null,
    jenis_kerja_id: item.jenis_kerja_id?.toString() || null,
    posisi_kerja_id: item.posisi_kerja_id?.toString() || null,
    lpk_mitra_id: item.lpk_mitra_id?.toString() || null,
    demografi_province_id: item.demografi_province_id?.toString() || null,
    demografi_regency_id: item.demografi_regency_id?.toString() || null,

    // Map relations (Handle both snake_case from DB and camelCase from Laravel Eloquent)
    siswa: item.siswa ? { ...item.siswa, id: item.siswa.id.toString() } : null,
    kumiai: item.kumiai ? { ...item.kumiai, id: item.kumiai.id.toString() } : null,
    perusahaan: item.perusahaan ? { ...item.perusahaan, id: item.perusahaan.id.toString() } : null,
    program: item.program ? { ...item.program, id: item.program.id.toString() } : null,

    jenis_kerja: item.jenis_kerja || (item.jenisKerja ? { ...item.jenisKerja, id: item.jenisKerja.id.toString() } : null),
    posisi_kerja: item.posisi_kerja || (item.posisiKerja ? { ...item.posisiKerja, id: item.posisiKerja.id.toString() } : null),
    lpk_mitra: item.lpk_mitra || (item.lpkMitra ? { ...item.lpkMitra, id: item.lpkMitra.id.toString() } : null),
    provinsi: item.provinsi || (item.demografiProvince ? { ...item.demografiProvince, id: item.demografiProvince.id.toString() } : null),
    kabupaten: item.kabupaten || (item.demografiRegency ? { ...item.demografiRegency, id: item.demografiRegency.id.toString() } : null),
  } as SiswaMagang;
};

export const siswaMagangService = {
  async fetchAll(): Promise<SiswaMagang[]> {
    console.log('Fetching siswa magang data from Laravel API...');
    try {
      const response = await authFetch(endpoints.siswaMagang);
      if (!response.ok) throw new Error('Failed to fetch from Laravel');
      const data = await response.json();
      return data.map(mapSiswaMagang);
    } catch (e) {
      console.error("Failed to fetch siswa magang", e);
      return [];
    }
  },

  async fetchById(id: string): Promise<SiswaMagang | null> {
    if (!id) return null;
    try {
      const response = await authFetch(`${endpoints.siswaMagang}/${id}`);
      if (!response.ok) return null;
      const data = await response.json();
      return mapSiswaMagang(data);
    } catch (e) {
      return null;
    }
  },

  async create(newSiswaMagang: CreateSiswaMagangData): Promise<SiswaMagang> {
    console.log('Creating siswa magang:', newSiswaMagang);
    const response = await authFetch(endpoints.siswaMagang, {
      method: 'POST',
      body: JSON.stringify(newSiswaMagang)
    });

    if (!response.ok) {
      const err = await response.json();
      const errorMessage = err.details ? `${err.message}: ${err.details}` : (err.message || 'Failed to create siswa magang');
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return mapSiswaMagang(data);
  },

  async update({ id, ...updates }: UpdateSiswaMagangData): Promise<SiswaMagang> {
    console.log('Updating siswa magang:', id);
    const response = await authFetch(`${endpoints.siswaMagang}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });

    if (!response.ok) throw new Error('Failed to update siswa magang');
    const data = await response.json();
    return mapSiswaMagang(data);
  },

  async delete(id: string): Promise<string> {
    console.log('Deleting siswa magang:', id);
    const response = await authFetch(`${endpoints.siswaMagang}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete siswa magang');
    return id;
  },

  async updateStatus(id: string, status: string): Promise<SiswaMagang> {
    const response = await authFetch(`${endpoints.siswaMagang}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status_magang: status })
    });
    if (!response.ok) throw new Error('Failed to update status');
    const data = await response.json();
    return mapSiswaMagang(data);
  },

  setupRealtimeSubscription(callback: (payload: any) => void) {
    return () => { };
  }
};
