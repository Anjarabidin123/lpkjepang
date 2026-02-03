
// import { rbacPermissionsTable, userRolesTable, rbacRolePermissionsTable, rbacRolesTable } from '@/lib/localStorage/tables';
import { Permission } from '@/types/rbac';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export class PermissionService {
  static async fetchPermissions(): Promise<Permission[]> {
    console.log('Fetching permissions from Laravel API...');
    try {
      const response = await authFetch(endpoints.permissions);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((p: any) => ({
        ...p,
        module: 'general', // Default for now
        display_name: p.name,
        description: null
      })) as Permission[];
    } catch (e) {
      return [];
    }
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
    // Ideally ask backend: GET /api/users/{id}/can?permission=X
    // For now, return true (Admin) or implement complex logic fetching all user roles
    return true;
  }

  static async getUserPermissions(userId: string): Promise<Permission[]> {
    // Fetch user with roles and permissions
    // Mocking return for now to avoid breaking UI flow until backend supports Permission check endpoint
    return [];
  }
}
