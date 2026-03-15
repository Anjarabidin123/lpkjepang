
// import { rbacRolesTable, rbacPermissionsTable, rbacRolePermissionsTable } from '@/lib/localStorage/tables';
import { Role, CreateRoleData, UpdateRoleData, RoleWithPermissions } from '@/types/rbac';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';
import { PermissionService } from './permissionService';

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
        display_name: r.display_name || r.name, // Fallback
        is_system_role: r.is_system_role || false,
        is_active: r.is_active !== undefined ? r.is_active : true
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

      // Parse permissions to ensure module/action are set
      const parsedPermissions = (role.permissions || []).map((p: any) => PermissionService.parsePermission(p));

      return {
        ...role,
        display_name: role.display_name || role.name,
        is_system_role: role.is_system_role || false,
        is_active: role.is_active !== undefined ? role.is_active : true,
        permissions: parsedPermissions
      } as RoleWithPermissions;
    } catch (e) {
      console.error('Error in fetchRoleWithPermissions:', e);
      return null;
    }
  }

  static async createRole(roleData: CreateRoleData): Promise<boolean> {
    console.log('Creating role via API:', roleData);
    try {
      const response = await authFetch(endpoints.roles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: roleData.name,
          display_name: roleData.display_name,
          description: roleData.description,
          is_active: roleData.is_active,
          is_system_role: roleData.is_system_role,
          permissions: roleData.permission_ids
        })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create role');
      }
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updates.name,
          display_name: updates.display_name,
          description: updates.description,
          is_active: updates.is_active,
          is_system_role: updates.is_system_role,
          permissions: updates.permission_ids
        })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update role');
      }
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
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to delete role');
    }
    return true;
  }

  static subscribeToRoles(callback: (roles: Role[]) => void) {
    return () => { };
  }
}
