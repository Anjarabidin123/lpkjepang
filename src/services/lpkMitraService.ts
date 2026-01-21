
import { lpkMitraTable } from '@/lib/localStorage/tables';
import { LpkMitra, CreateLpkMitraData, UpdateLpkMitraData } from '@/types/lpkMitra';

export class LpkMitraService {
  static async fetchAll(): Promise<LpkMitra[]> {
    console.log('Fetching all LPK Mitra from localStorage...');
    const data = lpkMitraTable.getAll();
    console.log('Fetched LPK Mitra:', data);
    return (data as LpkMitra[]) || [];
  }

  static async fetchById(id: string): Promise<LpkMitra | null> {
    console.log('Fetching LPK Mitra by ID from localStorage:', id);
    const data = lpkMitraTable.getById(id);
    return data as LpkMitra | null;
  }

  static async create(lpkMitraData: CreateLpkMitraData): Promise<LpkMitra | null> {
    console.log('Creating LPK Mitra in localStorage:', lpkMitraData);
    const data = lpkMitraTable.create(lpkMitraData);
    console.log('Created LPK Mitra:', data);
    return data as LpkMitra;
  }

  static async update(id: string, updateData: UpdateLpkMitraData): Promise<LpkMitra | null> {
    console.log('Updating LPK Mitra in localStorage:', { id, updateData });
    const data = lpkMitraTable.update(id, updateData);
    console.log('Updated LPK Mitra:', data);
    return data as LpkMitra;
  }

  static async delete(id: string): Promise<boolean> {
    console.log('Deleting LPK Mitra from localStorage:', id);
    const success = lpkMitraTable.delete(id);
    console.log('Deleted LPK Mitra successfully');
    return success;
  }
}

