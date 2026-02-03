import { SecurityService } from '../securityService';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export class UserDeleteService {
  static async deleteUser(id: string): Promise<boolean> {
    console.log('Deleting user via API:', id);

    try {
      const response = await authFetch(`${endpoints.users}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');
      return true;
    } catch (error) {
      console.error("Delete Error", error);
      throw error;
    }
  }
}
