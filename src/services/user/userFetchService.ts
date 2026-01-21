
import { profilesTable, userRolesTable } from '@/lib/localStorage/tables';
import { UserProfile } from '@/types/user';
import { SecurityService } from '../securityService';

export class UserFetchService {
  static async fetchUsers(): Promise<UserProfile[]> {
    console.log('Fetching users from localStorage...');
    
    try {
      // Log user data access
      await SecurityService.logSecurityEvent({
        event_type: 'user_data_access',
        event_details: { action: 'fetch_all_users' }
      });

      // Get all profiles from localStorage
      const profiles = profilesTable.getAll();
      const userRoles = userRolesTable.getAll();

      // Combine the data manually
      const usersWithRoles = profiles.map(profile => ({
        ...profile,
        user_roles: userRoles.filter(role => role.user_id === profile.id) || []
      })) || [];

      console.log('Fetched users successfully:', usersWithRoles.length);
      return usersWithRoles as UserProfile[];
    } catch (error) {
      await SecurityService.logSecurityEvent({
        event_type: 'user_data_access_error',
        event_details: { 
          action: 'fetch_all_users',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      throw error;
    }
  }
}
