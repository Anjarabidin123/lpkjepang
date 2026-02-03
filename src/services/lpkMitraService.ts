
import { endpoints } from '@/config/api';
import { LpkMitra, CreateLpkMitraData, UpdateLpkMitraData } from '@/types/lpkMitra';
import { authFetch } from '@/lib/api-client';

export class LpkMitraService {
  static async fetchAll(): Promise<LpkMitra[]> {
    console.log('Fetching all LPK Mitra from Laravel API...');
    try {
      const response = await authFetch(endpoints.lpkMitra);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        nama_lpk: item.nama_lpk || item.nama // Handle naming mismatch (backend 'nama' -> frontend 'nama_lpk')
      })) as LpkMitra[];
    } catch (e) {
      return [];
    }
  }

  static async fetchById(id: string): Promise<LpkMitra | null> {
    try {
      const response = await authFetch(`${endpoints.lpkMitra}/${id}`);
      if (!response.ok) return null;
      const data = await response.json();
      return {
        ...data,
        id: data.id.toString(),
        nama_lpk: data.nama_lpk || data.nama
      } as LpkMitra;
    } catch (e) {
      return null;
    }
  }

  static async create(lpkMitraData: CreateLpkMitraData): Promise<LpkMitra | null> {
    const response = await authFetch(endpoints.lpkMitra, {
      method: 'POST',
      body: JSON.stringify(lpkMitraData)
    });
    if (!response.ok) throw new Error('Failed to create LPK Mitra');
    const data = await response.json();
    return {
      ...data,
      id: data.id.toString(),
      nama_lpk: data.nama_lpk || data.nama
    } as LpkMitra;
  }

  static async update(id: string, updateData: UpdateLpkMitraData): Promise<LpkMitra | null> {
    const response = await authFetch(`${endpoints.lpkMitra}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    if (!response.ok) throw new Error('Failed to update LPK Mitra');
    const data = await response.json();
    return {
      ...data,
      id: data.id.toString(),
      nama_lpk: data.nama_lpk || data.nama
    } as LpkMitra;
  }

  static async delete(id: string): Promise<boolean> {
    const response = await authFetch(`${endpoints.lpkMitra}/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  }
}

