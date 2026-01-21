
import { rbacPermissionsTable, userRolesTable, rbacRolePermissionsTable, rbacRolesTable } from '@/lib/localStorage/tables';
import { Permission } from '@/types/rbac';

export class PermissionService {
  static async fetchPermissions(): Promise<Permission[]> {
    console.log('Fetching permissions from localStorage...');
    const data = rbacPermissionsTable.getAll();
    return (data as Permission[]) || [];
  }

  static async fetchPermissionsByModule(): Promise<Record<string, Permission[]>> {
    const permissions = await this.fetchPermissions();
    
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }

  static async checkUserPermission(userId: string, permissionName: string): Promise<boolean> {
    console.log('Checking user permission in localStorage:', userId, permissionName);
    
    try {
      const userRoles = userRolesTable.getAll().filter(ur => ur.user_id === userId);
      if (userRoles.length === 0) return false;

      const roleNames = userRoles.map(ur => ur.role);
      const roles = rbacRolesTable.getAll().filter(r => roleNames.includes(r.name));
      const roleIds = roles.map(r => r.id);

      const rolePermissions = rbacRolePermissionsTable.getAll().filter(rp => roleIds.includes(rp.role_id));
      const permissionIds = rolePermissions.map(rp => rp.permission_id);
      
      const permissions = rbacPermissionsTable.getAll().filter(p => permissionIds.includes(p.id));
      
      return permissions.some(p => p.name === permissionName);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  static async getUserPermissions(userId: string): Promise<Permission[]> {
    console.log('Getting user permissions from localStorage:', userId);
    
    try {
      const userRoles = userRolesTable.getAll().filter(ur => ur.user_id === userId);
      if (userRoles.length === 0) return [];

      const roleNames = userRoles.map(ur => ur.role);
      const roles = rbacRolesTable.getAll().filter(r => roleNames.includes(r.name));
      const roleIds = roles.map(r => r.id);

      const rolePermissions = rbacRolePermissionsTable.getAll().filter(rp => roleIds.includes(rp.role_id));
      const permissionIds = rolePermissions.map(rp => rp.permission_id);
      
      return rbacPermissionsTable.getAll().filter(p => permissionIds.includes(p.id)) as Permission[];
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }
}
