import { endpoints } from '@/config/api';
import { UpdateUserData } from '@/types/user';
import { authFetch } from '@/lib/api-client';

export class UserUpdateService {
  static async updateUser(id: string, updates: UpdateUserData): Promise<boolean> {
    console.log('Updating user via API:', id, updates);

    try {
      const payload: any = {};
      if (updates.full_name) payload.name = updates.full_name;
      if (updates.email) payload.email = updates.email;

      const response = await authFetch(`${endpoints.users}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update user');
      return true;
    } catch (error) {
      console.error("Update Error", error);
      throw error;
    }
  }

  static async updateUserRole(userId: string, newRole: string): Promise<boolean> {
    console.log('Updating user role via API:', userId, newRole);
    try {
      // 1. Fetch available roles to map role name to ID
      const rolesResponse = await authFetch(endpoints.roles);
      const roles = await rolesResponse.json();
      const targetRole = roles.find((r: any) => r.name === newRole);

      if (!targetRole) throw new Error('Role ID not found for ' + newRole);

      // 2. Update user roles (sync)
      const response = await authFetch(`${endpoints.users}/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
          roles: [targetRole.id]
        })
      });

      if (!response.ok) throw new Error('Failed to update user role');
      return true;
    } catch (error) {
      console.error("Update Role Error", error);
      throw error;
    }
  }
}
