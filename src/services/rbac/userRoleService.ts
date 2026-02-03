
// import { profilesTable, userRolesTable, rbacRolesTable } from '@/lib/localStorage/tables';
import { UserWithRoles, AssignRoleData } from '@/types/rbac';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export class UserRoleService {
  static async fetchUsersWithRoles(): Promise<UserWithRoles[]> {
    console.log('Fetching users with roles from API...');
    try {
      const response = await authFetch(endpoints.users);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();

      return data.map((u: any) => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        roles: u.roles || []
      })) as UserWithRoles[];
    } catch (e) {
      return [];
    }
  }

  static async assignRolesToUser(assignData: AssignRoleData): Promise<boolean> {
    console.log('Assigning roles to user API:', assignData);
    try {
      const response = await authFetch(`${endpoints.users}/${assignData.user_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          roles: assignData.role_ids
        })
      });
      if (!response.ok) throw new Error('Failed to assign roles');
      return true;
    } catch (error) {
      console.error('Error in assignRolesToUser:', error);
      throw error;
    }
  }

  static async getUserRoles(userId: string): Promise<string[]> {
    console.log('Getting user roles from API:', userId);
    try {
      const response = await authFetch(`${endpoints.users}/${userId}`);
      if (!response.ok) return [];
      const user = await response.json();
      return user.roles ? user.roles.map((r: any) => r.id.toString()) : [];
    } catch (e) {
      return [];
    }
  }

  static subscribeToUserRoles(callback: (users: UserWithRoles[]) => void) {
    return () => { };
  }
}
