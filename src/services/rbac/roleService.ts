
import { rbacRolesTable, rbacPermissionsTable, rbacRolePermissionsTable } from '@/lib/localStorage/tables';
import { Role, CreateRoleData, UpdateRoleData, RoleWithPermissions } from '@/types/rbac';

export class RoleService {
  static async fetchRoles(): Promise<Role[]> {
    console.log('Fetching roles from localStorage...');
    const data = rbacRolesTable.getAll();
    return (data as Role[]) || [];
  }

  static async fetchRoleWithPermissions(roleId: string): Promise<RoleWithPermissions | null> {
    console.log('Fetching role with permissions from localStorage:', roleId);
    
    const role = rbacRolesTable.getById(roleId);
    if (!role) return null;

    const rolePermissions = rbacRolePermissionsTable.getAll().filter(rp => rp.role_id === roleId);
    const permissionIds = rolePermissions.map(rp => rp.permission_id);
    const permissions = rbacPermissionsTable.getAll().filter(p => permissionIds.includes(p.id));

    return {
      ...role,
      permissions
    } as RoleWithPermissions;
  }

  static async createRole(roleData: CreateRoleData): Promise<boolean> {
    console.log('Creating role in localStorage:', roleData);
    
    try {
      const role = rbacRolesTable.create({
        name: roleData.name,
        display_name: roleData.display_name,
        description: roleData.description,
        is_system_role: false,
        is_active: true
      } as any);

      if (roleData.permission_ids && roleData.permission_ids.length > 0) {
        for (const permissionId of roleData.permission_ids) {
          rbacRolePermissionsTable.create({
            role_id: role.id,
            permission_id: permissionId
          } as any);
        }
      }

      return true;
    } catch (error) {
      console.error('Error in createRole:', error);
      throw error;
    }
  }

  static async updateRole(roleId: string, updates: UpdateRoleData): Promise<boolean> {
    console.log('Updating role in localStorage:', roleId, updates);
    
    try {
      rbacRolesTable.update(roleId, {
        name: updates.name,
        display_name: updates.display_name,
        description: updates.description,
        is_active: updates.is_active
      });

      if (updates.permission_ids !== undefined) {
        // Delete existing permissions
        const allRP = rbacRolePermissionsTable.getAll();
        const rpToKeep = allRP.filter(rp => rp.role_id !== roleId);
        rbacRolePermissionsTable.setAll(rpToKeep as any);

        // Insert new permissions
        for (const permissionId of updates.permission_ids) {
          rbacRolePermissionsTable.create({
            role_id: roleId,
            permission_id: permissionId
          } as any);
        }
      }

      return true;
    } catch (error) {
      console.error('Error in updateRole:', error);
      throw error;
    }
  }

  static async deleteRole(roleId: string): Promise<boolean> {
    console.log('Deleting role from localStorage:', roleId);
    return rbacRolesTable.delete(roleId);
  }

  static subscribeToRoles(callback: (roles: Role[]) => void) {
    console.log('localStorage subscription simulation for roles...');
    return () => {};
  }
}
