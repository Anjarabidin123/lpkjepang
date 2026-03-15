
// import { rbacPermissionsTable, userRolesTable, rbacRolePermissionsTable, rbacRolesTable } from '@/lib/localStorage/tables';
import { Permission } from '@/types/rbac';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export class PermissionService {
  static parsePermission(p: any): Permission {
    const name = p.name || '';
    let module = p.module || '';
    let action = p.action || '';

    // If module/action not provided, try to parse from name (e.g., "siswa_view")
    if (!module || module === 'general' || module === 'other') {
      const parts = name.split('_');
      // Common action keywords from RbacRoleInlineForm
      const actionKeywords = [
        'view', 'create', 'update', 'delete', 'manage',
        'access', 'generate', 'export', 'assign',
        'read', 'write', 'add', 'edit', 'destroy'
      ];

      // Find the action keyword
      const actionIndex = parts.findIndex(part => actionKeywords.includes(part));

      if (actionIndex > 0) {
        module = parts.slice(0, actionIndex).join('_');
        action = parts.slice(actionIndex).join('_');
      } else if (parts.length > 1) {
        // Fallback: take the last part as action if it has multiple parts
        module = parts.slice(0, -1).join('_');
        action = parts[parts.length - 1];
      } else {
        module = 'other';
        action = name;
      }
    }

    return {
      ...p,
      module: module,
      action: action,
      display_name: p.display_name || p.name,
      description: p.description || null,
      is_active: p.is_active !== undefined ? p.is_active : true
    } as Permission;
  }

  static async fetchPermissions(): Promise<Permission[]> {
    console.log('Fetching permissions from Laravel API...');
    try {
      const response = await authFetch(endpoints.permissions);
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((p: any) => this.parsePermission(p));
    } catch (e) {
      console.error('Error in fetchPermissions:', e);
      return [];
    }
  }

  static async fetchPermissionsByModule(): Promise<Record<string, Permission[]>> {
    const permissions = await this.fetchPermissions();

    return permissions.reduce((acc, permission) => {
      const module = permission.module || 'other';
      if (!acc[module]) {
        acc[module] = [];
      }
      acc[module].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }

  static async checkUserPermission(userId: string, permissionName: string): Promise<boolean> {
    // Ideally ask backend: GET /api/users/{id}/can?permission=X
    return true;
  }

  static async getUserPermissions(userId: string): Promise<Permission[]> {
    return [];
  }
}
