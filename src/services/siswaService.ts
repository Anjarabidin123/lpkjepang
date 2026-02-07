import { endpoints } from '@/config/api';
import type { Siswa } from '@/hooks/siswa/types';
import { authFetch } from '@/lib/api-client';

const mapSiswa = (item: any): Siswa => {
  if (!item) return item;
  return {
    ...item,
    id: item.id.toString(),
    demografi_province_id: item.demografi_province_id?.toString() || null,
    demografi_regency_id: item.demografi_regency_id?.toString() || null,
    program_id: item.program_id?.toString() || null,
    posisi_kerja_id: item.posisi_kerja_id?.toString() || null,
    lpk_mitra_id: item.lpk_mitra_id?.toString() || null,

    // Map relations (Handle camelCase and snake_case)
    provinsi: item.provinsi || (item.province ? { ...item.province, id: item.province.id.toString() } : null),
    kabupaten: item.kabupaten || (item.regency ? { ...item.regency, id: item.regency.id.toString() } : null),
    program: item.program ? { ...item.program, id: item.program.id.toString() } : null,
    posisi_kerja: item.posisi_kerja || (item.posisiKerja ? { ...item.posisiKerja, id: item.posisiKerja.id.toString() } : null),
    lpk_mitra: item.lpk_mitra || (item.lpkMitra ? { ...item.lpkMitra, id: item.lpkMitra.id.toString() } : null),
  } as Siswa;
};

export const siswaService = {
  async fetchAll(): Promise<Siswa[]> {
    console.log('Fetching siswa data from Laravel API...');
    try {
      const response = await authFetch(endpoints.siswa);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Siswa data fetched successfully from API:', data?.length || 0, 'records');
      return data.map(mapSiswa);
    } catch (error) {
      console.error("Failed to fetch from API, falling back to mock:", error);
      return [];
    }
  },

  async fetchAvailableForMagang(): Promise<Siswa[]> {
    console.log('Fetching available siswa for magang from Laravel API...');
    try {
      const response = await authFetch(endpoints.siswa);
      if (!response.ok) throw new Error('Failed to fetch from Laravel');
      const allSiswa = await response.json();
      return allSiswa.map(mapSiswa);
    } catch (error) {
      console.error("Failed to fetch available magang:", error);
      return [];
    }
  },

  async fetchById(id: string): Promise<Siswa | null> {
    if (!id) return null;
    try {
      const response = await authFetch(`${endpoints.siswa}/${id}`);
      const data = await response.json();
      return mapSiswa(data);
    } catch (e) {
      return null;
    }
  },

  async create(newSiswa: Omit<Siswa, 'id' | 'created_at' | 'updated_at'>): Promise<Siswa> {
    console.log('Creating siswa to Laravel API:', newSiswa);
    const response = await authFetch(endpoints.siswa, {
      method: 'POST',
      body: JSON.stringify(newSiswa)
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to create siswa');
    }
    const data = await response.json();
    return mapSiswa(data);
  },

  async update({ id, ...updates }: Partial<Siswa> & { id: string }): Promise<Siswa> {
    console.log('Updating siswa in Laravel API:', id);
    const response = await authFetch(`${endpoints.siswa}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to update siswa');
    }
    const data = await response.json();
    return mapSiswa(data);
  },

  async delete(id: string): Promise<string> {
    console.log('Deleting siswa from Laravel API:', id);
    const response = await authFetch(`${endpoints.siswa}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete siswa');
    }
    return id;
  }
};
