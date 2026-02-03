
import { UserProfile } from '@/types/user';
import { SecurityService } from '../securityService';
import { endpoints } from '@/config/api';
import { authFetch } from '@/lib/api-client';

export class UserFetchService {
  static async fetchUsers(): Promise<UserProfile[]> {
    console.log('Fetching users from Laravel API...');

    try {
      // Log user data access
      await SecurityService.logSecurityEvent({
        event_type: 'user_data_access',
        event_details: { action: 'fetch_all_users' }
      });

      const response = await authFetch(endpoints.users);
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();

      // Map Laravel User to UserProfile expected by frontend
      // Laravel: { id, name, email, roles: [...] }
      // Frontend: { id, email, full_name, user_roles: [...] }

      return data.map((u: any) => ({
        id: u.id.toString(),
        email: u.email,
        full_name: u.name,
        avatar_url: u.avatar_url || null, // Jika ada
        user_roles: u.roles ? u.roles.map((r: any) => ({
          id: r.id.toString(),
          user_id: u.id.toString(),
          role: r.name
        })) : [],
        created_at: u.created_at,
        updated_at: u.updated_at
      })) as UserProfile[];

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
