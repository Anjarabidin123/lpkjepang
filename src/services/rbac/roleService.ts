
// import { rbacRolesTable, rbacPermissionsTable, rbacRolePermissionsTable } from '@/lib/localStorage/tables';
import { Role, CreateRoleData, UpdateRoleData, RoleWithPermissions } from '@/types/rbac';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export class RoleService {
  static async fetchRoles(): Promise<Role[]> {
    console.log('Fetching roles from Laravel API...');
    try {
      const response = await authFetch(endpoints.roles);
      if (!response.ok) throw new Error('Failed to fetch roles');
      // Mapper jika field beda (laravel: name, description. frontend: name, description, display_name)
      const data = await response.json();
      return data.map((r: any) => ({
        ...r,
        display_name: r.name, // Fallback
        is_system_role: false,
        is_active: true
      })) as Role[];
    } catch (e) {
      return [];
    }
  }

  static async fetchRoleWithPermissions(roleId: string): Promise<RoleWithPermissions | null> {
    console.log('Fetching role with permissions from API:', roleId);
    try {
      const response = await authFetch(`${endpoints.roles}/${roleId}`);
      if (!response.ok) return null;
      const role = await response.json();
      return {
        ...role,
        display_name: role.name,
        is_system_role: false,
        is_active: true,
        permissions: role.permissions || []
      } as RoleWithPermissions;
    } catch (e) {
      return null;
    }
  }

  static async createRole(roleData: CreateRoleData): Promise<boolean> {
    console.log('Creating role via API:', roleData);
    try {
      const response = await authFetch(endpoints.roles, {
        method: 'POST',
        body: JSON.stringify({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permission_ids
        })
      });
      if (!response.ok) throw new Error('Failed to create role');
      return true;
    } catch (error) {
      console.error('Error in createRole:', error);
      throw error;
    }
  }

  static async updateRole(roleId: string, updates: UpdateRoleData): Promise<boolean> {
    console.log('Updating role via API:', roleId, updates);
    try {
      const response = await authFetch(`${endpoints.roles}/${roleId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: updates.name,
          description: updates.description,
          permissions: updates.permission_ids
        })
      });
      if (!response.ok) throw new Error('Failed to update role');
      return true;
    } catch (error) {
      console.error('Error in updateRole:', error);
      throw error;
    }
  }

  static async deleteRole(roleId: string): Promise<boolean> {
    console.log('Deleting role via API:', roleId);
    const response = await authFetch(`${endpoints.roles}/${roleId}`, {
      method: 'DELETE',
    });
    return response.ok;
  }

  static subscribeToRoles(callback: (roles: Role[]) => void) {
    return () => { };
  }
}
