
import { profilesTable, userRolesTable, rbacRolesTable } from '@/lib/localStorage/tables';
import { UserWithRoles, AssignRoleData } from '@/types/rbac';

export class UserRoleService {
  static async fetchUsersWithRoles(): Promise<UserWithRoles[]> {
    console.log('Fetching users with roles from localStorage...');
    
    const profiles = profilesTable.getAll();
    const userRoles = userRolesTable.getAll();
    const rbacRoles = rbacRolesTable.getAll();

    const usersWithRoles = profiles.map(profile => {
      const assignedRoles = userRoles
        .filter(ur => ur.user_id === profile.id)
        .map(ur => rbacRoles.find(r => r.name === ur.role))
        .filter(Boolean);

      return {
        ...profile,
        roles: assignedRoles
      };
    });

    return usersWithRoles as UserWithRoles[];
  }

  static async assignRolesToUser(assignData: AssignRoleData): Promise<boolean> {
    console.log('Assigning roles to user in localStorage:', assignData);
    
    try {
      // Deactivate existing role assignments
      const allRoles = userRolesTable.getAll();
      const rolesToKeep = allRoles.filter(role => role.user_id !== assignData.user_id);
      userRolesTable.setAll(rolesToKeep as any);

      // Insert new role assignments
      for (const roleId of assignData.role_ids) {
        const role = rbacRolesTable.getById(roleId);
        if (role) {
          userRolesTable.create({
            user_id: assignData.user_id,
            role: role.name
          } as any);
        }
      }

      return true;
    } catch (error) {
      console.error('Error in assignRolesToUser:', error);
      throw error;
    }
  }

  static async getUserRoles(userId: string): Promise<string[]> {
    console.log('Getting user roles from localStorage:', userId);
    
    const userRoles = userRolesTable.getAll().filter(ur => ur.user_id === userId);
    const roleNames = userRoles.map(ur => ur.role);
    const roles = rbacRolesTable.getAll().filter(r => roleNames.includes(r.name));
    
    return roles.map(r => r.id);
  }

  static subscribeToUserRoles(callback: (users: UserWithRoles[]) => void) {
    console.log('localStorage subscription simulation for user roles...');
    return () => {};
  }
}
