import { endpoints } from '@/config/api';
import { CreateUserData } from '@/types/user';
import { authFetch } from '@/lib/api-client';

export class UserCreateService {
  static async createUser(userData: CreateUserData): Promise<boolean> {
    console.log('Creating user via API:', userData);

    try {
      // 1. Fetch available roles to map role name to ID
      const rolesResponse = await authFetch(endpoints.roles);
      const roles = await rolesResponse.json();
      const targetRole = roles.find((r: any) => r.name === userData.role);

      const passwordToken = userData.password || 'password123';
      const payload: any = {
        name: userData.full_name,
        email: userData.email,
        password: passwordToken,
        password_confirmation: passwordToken, // Required by Laravel 'confirmed' validation
        roles: targetRole ? [targetRole.id] : []
      };

      const response = await authFetch(endpoints.users, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create user');
      }

      console.log('User created successfully in API');
      return true;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }
}
